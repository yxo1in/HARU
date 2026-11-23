import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Button } from "@/components/button";
import { ChartFrame, ChartLabel, ChartLine, ChartPoint } from "@/components/chart-frame";
import { Chip } from "@/components/chip";
import { RecordItem } from "@/components/record-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { getToken, removeToken } from "@/lib/token";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Category = "intro" | "motivation" | "personality" | "technical";

const CATEGORY_LABELS: Record<Category, string> = {
  intro: "자기소개",
  motivation: "지원동기",
  personality: "인성",
  technical: "기술",
};

const CHIPS: { label: string; category: Category | null }[] = [
  { label: "전체", category: null },
  { label: "자기소개", category: "intro" },
  { label: "지원동기", category: "motivation" },
  { label: "인성", category: "personality" },
  { label: "기술", category: "technical" },
];

type Summary = {
  averageScore: number | null;
  totalAnswers: number;
  bestScore: number | null;
};

type ScorePoint = { answerId: number; answerDate: string; score: number };

type RecordListItem = {
  id: number;
  answerDate: string;
  category: Category;
  question: string;
  score: number | null;
  feedbackStatus: "pending" | "done" | "failed";
  retryCount: number;
};

type RecordPage = { items: RecordListItem[]; nextCursor: number | null };

const GRID_LINES = [
  { y: 135, label: "60" },
  { y: 82, label: "80" },
  { y: 29, label: "100" },
];

const CHART = { left: 49.76, right: 312.31 };
// 격자 기준 60점이 y=135, 80점이 y=82 → 1점당 2.65px.
// 60점 아래는 날짜 라벨과 겹치지 않게 y=160 에서 멈춤 (약 51점 이하는 같은 높이)
const scoreToY = (score: number) => Math.min(160, 135 - (score - 60) * 2.65);

const pad = (n: number) => String(n).padStart(2, "0");

function formatDate(date: string) {
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  if (date === today) return "오늘";
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

async function getJson<T>(path: string): Promise<T | null> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    await removeToken();
    router.replace("/");
    return null;
  }
  if (!res.ok) throw new Error(`${path} status ${res.status}`);
  return res.json();
}

function EmptyRecord() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  return (
    <View style={styles.container}>
      <ScreenHeader title="기록" />
      <View style={styles.empty}>
        <View style={styles.emptyMascot}>
          <Image
            source={assets.haruEmpty}
            style={styles.emptyHaru}
          />
        </View>
        <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
        <Text style={styles.emptyText}>{"첫 답변을 남기면\n점수 흐름이 여기 쌓여요"}</Text>
        <Button
          label="첫 질문 받기"
          size="sm"
          style={styles.emptyButton}
          onPress={() => router.navigate("/question")}
        />
      </View>
    </View>
  );
}

export default function Record() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const [selectedChip, setSelectedChip] = useState(CHIPS[0]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [page, setPage] = useState<RecordPage | null>(null);
  const [points, setPoints] = useState<ScorePoint[]>([]);
  const loadingMore = useRef(false);

  // 탭으로 돌아올 때마다 요약 + 기록 첫 페이지를 다시 불러옴
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const [nextSummary, firstPage] = await Promise.all([
            getJson<Summary>("/api/stats/summary"),
            getJson<RecordPage>("/api/answers"),
          ]);
          if (!active || !nextSummary || !firstPage) return;
          setSummary(nextSummary);
          setPage(firstPage);
        } catch (e) {
          console.log("record load failed:", e);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  // 점수 흐름은 선택한 질문 유형이 바뀔 때도 다시 불러옴
  const category = selectedChip.category;
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const query = category ? `?category=${category}` : "";
          const data = await getJson<{ points: ScorePoint[] }>(`/api/stats/scores${query}`);
          if (active && data) setPoints(data.points);
        } catch (e) {
          console.log("score load failed:", e);
        }
      })();
      return () => {
        active = false;
      };
    }, [category]),
  );

  // 목록 끝 근처까지 스크롤하면 다음 페이지를 이어 붙임
  async function loadMore() {
    if (!page?.nextCursor || loadingMore.current) return;
    loadingMore.current = true;
    try {
      const next = await getJson<RecordPage>(`/api/answers?cursor=${page.nextCursor}`);
      if (next) {
        setPage((prev) => ({
          items: [...(prev?.items ?? []), ...next.items],
          nextCursor: next.nextCursor,
        }));
      }
    } catch (e) {
      console.log("record load more failed:", e);
    } finally {
      loadingMore.current = false;
    }
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) {
      loadMore();
    }
  }

  if (!summary || !page) return null;
  if (page.items.length === 0) return <EmptyRecord />;

  const step = points.length > 1 ? (CHART.right - CHART.left) / (points.length - 1) : 0;
  const coords: [number, number][] = points.map((point, i) => [
    points.length > 1 ? CHART.left + i * step : CHART.right,
    scoreToY(point.score),
  ]);
  const latest = points[points.length - 1];
  const [latestX, latestY] = coords[coords.length - 1] ?? [0, 0];

  return (
    <View style={styles.container}>
      <ScreenHeader title="기록" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        <View style={styles.stats}>
          <View>
            <Text style={styles.average}>
              {summary.averageScore === null ? "-" : `${summary.averageScore}점`}
            </Text>
            <Text style={styles.statLabel}>평균 점수</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.side}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>총 답변</Text>
              <Text style={styles.statValue}>{summary.totalAnswers}회</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>최고 점수</Text>
              <Text style={styles.statValue}>
                {summary.bestScore === null ? "-" : `${summary.bestScore}점`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="점수 흐름"
            trailing={points.length > 0 ? `최근 ${points.length}회` : undefined}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {CHIPS.map((chip) => (
              <Chip
                key={chip.label}
                label={chip.label}
                selected={chip.label === selectedChip.label}
                onPress={() => setSelectedChip(chip)}
              />
            ))}
          </ScrollView>
          <ChartFrame height={211}>
            {GRID_LINES.map(({ y, label }) => (
              <View key={label}>
                <Image
                  source={assets.chartRecordGrid}
                  style={[styles.grid, { top: y - 0.5 }]}
                />
                <ChartLabel x={20} y={y - 9} text={label} />
              </View>
            ))}
            {latest ? (
              <>
                {coords.slice(1).map((coord, i) => (
                  <ChartLine key={i} from={coords[i]} to={coord} />
                ))}
                {/* ChartPoint 는 왼쪽 위 기준이라 점 크기의 절반(8→4, 12→6)만큼 당김 */}
                {coords.slice(0, -1).map(([x, y], i) => (
                  <ChartPoint key={i} x={x - 4} y={y - 4} />
                ))}
                <ChartPoint x={latestX - 6} y={latestY - 6} latest />
                <ChartLabel
                  x={latestX - 12.7}
                  y={Math.max(0, latestY - 30)}
                  text={`${latest.score}점`}
                  highlight
                />
                {points.length > 1 && (
                  <ChartLabel x={CHART.left} y={175} text={formatDate(points[0].answerDate)} />
                )}
                <ChartLabel x={292.18} y={175} text={formatDate(latest.answerDate)} />
              </>
            ) : (
              <ChartLabel x={110} y={175} text="이 유형은 아직 점수가 없어요" />
            )}
          </ChartFrame>
        </View>

        <View style={styles.section}>
          <SectionHeader title="전체 기록" />
          {page.items.map((item) => (
            <RecordItem
              key={item.id}
              meta={`${CATEGORY_LABELS[item.category]}, ${formatDate(item.answerDate)}`}
              question={item.question}
              score={item.score}
              onPress={() =>
                router.push({ pathname: "/record-detail", params: { id: String(item.id) } })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: spacing["2xl"],
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
  },
  average: {
    ...typography.display,
    color: colors.textAccent,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  divider: {
    width: 1,
    height: 56,
    backgroundColor: colors.borderDefault,
  },
  side: {
    width: 148,
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statValue: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  chips: {
    gap: spacing.sm,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyMascot: {
    width: 160,
    height: 160,
  },
  emptyHaru: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 160,
    height: 160,
  },
  emptyTitle: {
    ...typography.h2,
    textAlign: "center",
    color: colors.textPrimary,
  },
  emptyText: {
    ...typography.bodyMedium,
    marginTop: spacing.sm,
    textAlign: "center",
    color: colors.textTertiary,
  },
  emptyButton: {
    marginTop: spacing.xl,
  },
  grid: {
    position: "absolute",
    left: 49.76,
    width: 262.554,
    height: 1,
  },
});

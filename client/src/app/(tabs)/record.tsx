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
import { ChartLine } from "@/components/chart-frame";
import { Chip } from "@/components/chip";
import { HistoryRow } from "@/components/history-row";
import { ScreenHeader } from "@/components/screen-header";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, radius, spacing, type ThemeColors } from "@/constants/theme";
import { getJson } from "@/lib/api";
import { type Category, type RecordPage } from "@/lib/records";

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

// 점수 흐름 차트 (Figma 카드 안쪽 309 x 150). 점은 좌우 12px 안쪽부터
// 눈금 고정: 80점이 y=66(노란 띠), 1점당 2.4px. 너무 높거나 낮으면 칸 안에서 멈춤
const CHART_HEIGHT = 150;
const CHART_SIDE = 12;
const BAND_Y = 66;
const BASELINE_Y = 126;
const scoreToY = (score: number) => Math.min(122, Math.max(14, BAND_Y - (score - 80) * 2.4));

// "2026-11-15" → "11/15"
const shortDate = (date: string) => {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
};

// 날짜 글자가 겹치지 않게 처음, 끝, 그리고 하나 걸러 하나만 표시
const showDate = (i: number, count: number) =>
  count <= 5 || i === 0 || i === count - 1 || (i % 2 === 1 && i !== count - 2);

function ScoreFlow({ points }: { points: ScorePoint[] }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  const right = width - CHART_SIDE;
  const step = points.length > 1 ? (right - CHART_SIDE) / (points.length - 1) : 0;
  const coords: [number, number][] = width
    ? points.map((point, i) => [
        points.length > 1 ? CHART_SIDE + i * step : right,
        scoreToY(point.score),
      ])
    : [];
  const last = coords.length - 1;

  return (
    <View style={styles.chart} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.band} />
      <View style={styles.baseline} />
      {points.length === 0 && (
        <Text style={styles.chartEmpty}>이 유형은 아직 점수가 없어요</Text>
      )}
      {coords.slice(1).map((coord, i) => (
        <ChartLine key={`line-${i}`} from={coords[i]} to={coord} color={colors.text} width={2} />
      ))}
      {coords.map(([x, y], i) => {
        const latest = i === last;
        const size = latest ? 11.5 : 8.5;
        return (
          <View key={points[i].answerId}>
            <View
              style={[latest ? styles.dotLatest : styles.dot, { left: x - size / 2, top: y - size / 2 }]}
            />
            <Text
              style={[
                latest ? styles.scoreLatest : styles.score,
                { left: x - 20, top: y - (latest ? 31 : 25) },
              ]}
            >
              {points[i].score}
            </Text>
            {showDate(i, coords.length) && (
              <Text
                style={[
                  styles.chartDate,
                  i === 0 && coords.length > 1
                    ? { left: 0, textAlign: "left" }
                    : latest
                      ? { right: 0, textAlign: "right" }
                      : { left: x - 20 },
                ]}
              >
                {shortDate(points[i].answerDate)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function SummaryRow({ summary }: { summary: Summary }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.summary}>
      <View style={styles.summaryItem}>
        {summary.averageScore === null ? (
          <Text style={styles.summaryEmpty}>-</Text>
        ) : (
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryAverage}>{summary.averageScore}</Text>
            <Text style={styles.summaryUnit}>점</Text>
          </View>
        )}
        <Text style={styles.summaryLabel}>평균 점수</Text>
      </View>
      <View style={[styles.summaryItem, styles.summaryItemSide]}>
        <View style={styles.summaryValueRow}>
          <Text style={styles.summaryValue}>{summary.totalAnswers}</Text>
          <Text style={styles.summaryUnit}>번</Text>
        </View>
        <Text style={styles.summaryLabel}>정식 답변</Text>
      </View>
      <View style={[styles.summaryItem, styles.summaryItemSide]}>
        {summary.bestScore === null ? (
          <Text style={styles.summaryEmpty}>-</Text>
        ) : (
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryValue}>{summary.bestScore}</Text>
            <Text style={styles.summaryUnit}>점</Text>
          </View>
        )}
        <Text style={styles.summaryLabel}>최고 점수</Text>
      </View>
    </View>
  );
}

function EmptyRecord({ summary }: { summary: Summary }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <ScreenHeader title="기록" />
      <View style={[styles.body, styles.emptyBody]}>
        <SummaryRow summary={summary} />
        <View>
          <View style={styles.emptyBinding} />
          <View style={styles.emptySheet}>
            <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
            <Text style={styles.emptyText}>
              오늘의 질문에 답하면 점수와 첨삭이 이곳에 한 장씩 쌓여요.
            </Text>
            <Button
              label="오늘 질문 받기"
              style={styles.emptyButton}
              onPress={() => router.navigate("/question")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function Record() {
  const styles = useThemedStyles(createStyles);
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
  if (page.items.length === 0) return <EmptyRecord summary={summary} />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="기록" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        <SummaryRow summary={summary} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CHIPS.map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              compact
              selected={chip.label === selectedChip.label}
              onPress={() => setSelectedChip(chip)}
            />
          ))}
        </ScrollView>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>점수 흐름</Text>
            {points.length > 0 && (
              <Text style={styles.cardMeta}>{`최근 정식 답변 ${points.length}번`}</Text>
            )}
          </View>
          <ScoreFlow points={points} />
          <View style={styles.legend}>
            <View style={styles.legendSwatch} />
            <Text style={styles.legendText}>80점 선</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>정식 답변</Text>
          <Text style={styles.sectionMeta}>재답변은 상세에서 볼 수 있어요</Text>
        </View>
        <View>
          {page.items.map((item, i) => (
            <View key={item.id}>
              {i > 0 && <View style={styles.divider} />}
              <HistoryRow
                item={item}
                onPress={() =>
                  router.push({ pathname: "/record-detail", params: { id: String(item.id) } })
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: spacing.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },

  // 요약
  summary: {
    flexDirection: "row",
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemSide: {
    paddingLeft: spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: colors.line,
  },
  summaryValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  summaryAverage: {
    fontFamily: fonts.pen,
    fontSize: 44,
    lineHeight: 40,
    color: colors.accent,
  },
  summaryValue: {
    fontFamily: fonts.bold,
    fontSize: 26,
    letterSpacing: -0.52,
    color: colors.text,
  },
  summaryEmpty: {
    fontFamily: fonts.bold,
    fontSize: 26,
    letterSpacing: -0.52,
    color: colors.textFaint,
  },
  summaryUnit: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSub,
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSub,
  },

  chips: {
    gap: 6,
  },

  // 점수 흐름 카드
  card: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  cardMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  chart: {
    height: CHART_HEIGHT,
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BAND_Y - 5,
    height: 10,
    backgroundColor: colors.chartBand,
  },
  baseline: {
    position: "absolute",
    left: 0,
    right: 0,
    top: BASELINE_Y,
    height: 1,
    backgroundColor: colors.line,
  },
  chartEmpty: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 92,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  dot: {
    position: "absolute",
    width: 8.5,
    height: 8.5,
    borderRadius: 4.25,
    borderWidth: 1.5,
    borderColor: colors.text,
    backgroundColor: colors.surface,
  },
  dotLatest: {
    position: "absolute",
    width: 11.5,
    height: 11.5,
    borderRadius: 5.75,
    backgroundColor: colors.accent,
  },
  score: {
    position: "absolute",
    width: 40,
    textAlign: "center",
    fontFamily: fonts.pen,
    fontSize: 20,
    lineHeight: 18,
    color: colors.textSub,
  },
  scoreLatest: {
    position: "absolute",
    width: 40,
    textAlign: "center",
    fontFamily: fonts.pen,
    fontSize: 28,
    lineHeight: 25,
    color: colors.accent,
  },
  chartDate: {
    position: "absolute",
    top: 132,
    width: 40,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textFaint,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 16,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.highlight,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSub,
  },

  // 정식 답변 목록
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.text,
  },
  sectionMeta: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },

  // 빈 상태
  emptyBody: {
    gap: 20,
  },
  emptyBinding: {
    height: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.accent,
  },
  emptySheet: {
    gap: spacing.sm,
    paddingHorizontal: 22,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.lineSoft,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.2,
    color: colors.text,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSub,
  },
  emptyButton: {
    alignSelf: "flex-start",
    width: 170,
    height: 52,
    marginTop: spacing.sm,
  },
});

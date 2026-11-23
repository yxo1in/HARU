import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { ChartFrame, ChartLabel, ChartLine, ChartPoint } from "@/components/chart-frame";
import { JobPill, StreakPill } from "@/components/header-pill";
import { QuestItem } from "@/components/quest-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { StreakDay } from "@/components/streak-day";
import {
  radius,
  spacing,
  typography,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { useCallback, useState } from "react";
import { getToken, removeToken } from "@/lib/token";
import { JOB_ROLE_NAMES } from "@/constants/jobs";

const WEEKLY_GOAL = 5;

type Quests = {
  answeredToday: boolean;
  over80Today: boolean;
  weeklyCount: number;
};

// 서버의 quests 값으로 오늘의 목표 3개를 만듦
function buildQuests(quests: Quests) {
  return [
    { iconKey: "questWrite", title: "답변 1개 쓰기", current: quests.answeredToday ? 1 : 0, total: 1 },
    { iconKey: "questTarget", title: "80점 넘기기", current: quests.over80Today ? 1 : 0, total: 1 },
    {
      iconKey: "questCalendar",
      title: `이번 주 답변 ${WEEKLY_GOAL}개`,
      current: Math.min(quests.weeklyCount, WEEKLY_GOAL),
      total: WEEKLY_GOAL,
    },
  ] as const;
}

const CHART = { left: 23.64, right: 287.67, top: 30, bottom: 66 };
function toChartPoints(scores: number[]): [number, number][] {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const step = scores.length > 1 ? (CHART.right - CHART.left) / (scores.length - 1) : 0;

  return scores.map((score, i) => {
    const x = scores.length > 1 ? CHART.left + i * step : CHART.right;
    const y =
      max === min
        ? (CHART.top + CHART.bottom) / 2
        : CHART.bottom - ((score - min) / (max - min)) * (CHART.bottom - CHART.top);
    return [x, y];
  });
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Home() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  type HomeData = {
    nickname: string;
    jobRoleId: number | null;
    jobRoleName: string | null;
    last7Days: { date: string, day: string, status: "done" | "today" | "missed"}[];
    streak: number
    scores: number[];
    quests: Quests;
  };

  const [home, setHome] = useState<HomeData | null>(null);
  // 탭은 한 번 열리면 계속 떠 있으므로, 홈으로 돌아올 때마다 다시 불러옴
  // (프로필에서 바꾼 닉네임/직무 반영)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const token = await getToken();
          const res = await fetch(`${API_URL}/api/home`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 401) {
            await removeToken();
            router.replace("/");
            return;
          }
          if (!res.ok) throw new Error(`status ${res.status}`);
          const data = await res.json();
          if (active) setHome(data);
        } catch (e) {
          console.log("home load failed:", e);
        }
      })();
      // 응답 오기 전에 다른 탭으로 가면 결과를 버림
      return () => {
        active = false;
      };
    }, []),
  );

  if (!home) return null;
  const { nickname, jobRoleName } = home;
  const job = Object.keys(JOB_ROLE_NAMES).find(
    (key) => JOB_ROLE_NAMES[key] === jobRoleName,
  );
  const {last7Days} = home
  const DAYS = last7Days
  const quests = buildQuests(home.quests);
  const doneCount = quests.filter((quest) => quest.current >= quest.total).length;
  const { scores } = home;
  const points = toChartPoints(scores);
  const [latestX, latestY] = points[points.length - 1] ?? [0, 0];
  const [firstX, firstY] = points[0] ?? [0, 0];
  return (
    <View style={styles.container}>
      <ScreenHeader>
        <View style={styles.pills}>
          <JobPill job={job ?? "직무 선택"} />
          <StreakPill days={home.streak} />
        </View>
      </ScreenHeader>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            {`${nickname}님,\n오늘도 한 번\n연습해볼까요?`}
          </Text>
          <Image source={assets.haruHome} style={styles.haru} />
        </View>

        <Button
          label="연습 시작하기"
          onPress={() => router.navigate("/question")}
        />

        <View style={styles.section}>
          <SectionHeader title="지난 7일" />
          <View style={styles.days}>
            {DAYS.map((item) => (
              <StreakDay key={item.date} {...item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="점수 흐름"
            trailing="기록 보기"
            onPressTrailing={() => router.navigate("/record")}
          />
          {scores.length === 0 ? (
            <View style={styles.chartEmpty}>
              <Image source={assets.haruEmpty} style={styles.chartEmptyHaru} />
              <Text style={styles.chartEmptyText}>
                {"첫 답변을 남기면\n점수 흐름이 여기 쌓여요"}
              </Text>
            </View>
          ) : (
            <ChartFrame height={125}>
              <Image source={assets.chartHomeBaseline} style={styles.baseline} />
              {points.slice(1).map((point, i) => (
                <ChartLine key={i} from={points[i]} to={point} />
              ))}
              {/* ChartPoint 는 왼쪽 위 기준이라 점 크기의 절반(8→4, 12→6)만큼 당김 */}
              {points.slice(0, -1).map(([x, y], i) => (
                <ChartPoint key={i} x={x - 4} y={y - 4} />
              ))}
              <ChartPoint x={latestX - 6} y={latestY - 6} latest />
              <ChartLabel
                x={latestX + 10.4}
                y={latestY - 10}
                text={`${scores[scores.length - 1]}점`}
                highlight
              />
              {scores.length > 1 && (
                <>
                  <ChartLabel x={firstX - 2.2} y={Math.max(0, firstY - 24)} text={`${scores[0]}점`} />
                  <ChartLabel x={23.64} y={89} text={`${scores.length}회 전`} />
                </>
              )}
              <ChartLabel x={277.2} y={89} text="최근" />
            </ChartFrame>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.goalsHeader}>
            <SectionHeader title="오늘의 목표" trailing={`${doneCount}/${quests.length} 완료`} />
          </View>
          {quests.map(({ iconKey, ...quest }) => (
            <QuestItem key={quest.title} icon={assets[iconKey]} {...quest} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
    pills: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
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
    greeting: {
      height: 236,
    },
    greetingText: {
      ...typography.display,
      color: colors.textPrimary,
    },
    // 화면 폭이 달라도 오른쪽 기준으로 붙임 (Figma Haru 박스)
    haru: {
      position: "absolute",
      right: -32.2,
      top: 93.2,
      width: 173,
      height: 173,
    },
    section: {
      gap: spacing.md,
    },
    days: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.bgPrimary,
    },
    baseline: {
      position: "absolute",
      left: 23.64,
      top: 80.5,
      width: 264.03,
      height: 1,
    },
    chartEmpty: {
      height: 125,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.bgPrimary,
    },
    chartEmptyHaru: {
      width: 72,
      height: 72,
    },
    chartEmptyText: {
      ...typography.bodyMedium,
      color: colors.textTertiary,
    },
    goalsHeader: {
      paddingBottom: spacing.xs,
    },
  });

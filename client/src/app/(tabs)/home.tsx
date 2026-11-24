import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { ChartLine } from "@/components/chart-frame";
import { ScreenHeader } from "@/components/screen-header";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, radius, spacing, type ThemeColors } from "@/constants/theme";
import { getJson } from "@/lib/api";

const WEEKLY_GOAL = 5;
const WEEKDAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

type Quests = {
  answeredToday: boolean;
  over80Today: boolean;
  weeklyCount: number;
};

type HomeData = {
  nickname: string;
  jobRoleId: number | null;
  jobRoleName: string | null;
  last7Days: { date: string; day: string; status: "done" | "today" | "missed" }[];
  streak: number;
  scores: { date: string; score: number }[];
  quests: Quests;
};

// 서버의 quests 값으로 오늘의 목표 3개를 만듦
function buildGoals(quests: Quests) {
  return [
    { title: "답변 1개 쓰기", current: quests.answeredToday ? 1 : 0, total: 1 },
    { title: "오늘 답변으로 80점 넘기기", current: quests.over80Today ? 1 : 0, total: 1 },
    {
      title: `이번 주(월~일)에 답변 ${WEEKLY_GOAL}개`,
      current: Math.min(quests.weeklyCount, WEEKLY_GOAL),
      total: WEEKLY_GOAL,
    },
  ];
}

// 점수 차트 (Figma 345 x 150). 점은 안쪽 12px 부터, 세로는 최저점이 아래 최고점이 위
const CHART_HEIGHT = 150;
const CHART_SIDE = 12;
const CHART_TOP = 47.2; // 최고점 높이
const CHART_BOTTOM = 83.7; // 최저점 높이
const CHART_BASELINE = 120;

function toChartPoints(scores: number[], width: number): [number, number][] {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const right = width - CHART_SIDE;
  const step = scores.length > 1 ? (right - CHART_SIDE) / (scores.length - 1) : 0;

  return scores.map((score, i) => [
    scores.length > 1 ? CHART_SIDE + i * step : right,
    max === min
      ? (CHART_TOP + CHART_BOTTOM) / 2
      : CHART_BOTTOM - ((score - min) / (max - min)) * (CHART_BOTTOM - CHART_TOP),
  ]);
}

// "2026-11-15" → "11/15"
const shortDate = (date: string) => {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
};

function ScoreChart({ scores }: { scores: HomeData["scores"] }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);

  if (scores.length === 0) {
    return (
      <View style={styles.chartEmpty}>
        <Text style={styles.chartEmptyText}>첫 답변을 남기면 점수가 여기 쌓여요</Text>
      </View>
    );
  }

  const points = width ? toChartPoints(scores.map((item) => item.score), width) : [];
  const last = points.length - 1;

  return (
    <View style={styles.chart} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.chartBaseline} />
      {points.slice(1).map((point, i) => (
        <ChartLine key={`line-${i}`} from={points[i]} to={point} color={colors.text} width={2} />
      ))}
      {points.map(([x, y], i) => {
        const latest = i === last;
        const size = latest ? 10 : 7;
        return (
          <View key={`dot-${i}`}>
            <View
              style={[
                latest ? styles.dotLatest : styles.dot,
                { left: x - size / 2 - 0.75, top: y - size / 2 - 0.75 },
              ]}
            />
            <Text
              style={[
                latest ? styles.scoreLatest : styles.score,
                { left: x - 20, top: y - (latest ? 34 : 28) },
              ]}
            >
              {scores[i].score}
            </Text>
            <Text
              style={[
                styles.chartDate,
                // 첫 날짜는 왼쪽 끝, 마지막은 오른쪽 끝에 맞춤
                i === 0 && points.length > 1
                  ? { left: 0, textAlign: "left" }
                  : latest
                    ? { right: 0, textAlign: "right" }
                    : { left: x - 20 },
              ]}
            >
              {shortDate(scores[i].date)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function Home() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const [home, setHome] = useState<HomeData | null>(null);

  // 탭은 한 번 열리면 계속 떠 있으므로, 홈으로 돌아올 때마다 다시 불러옴
  // (프로필에서 바꾼 닉네임/직무 반영)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const data = await getJson<HomeData>("/api/home");
          if (active && data) setHome(data);
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

  const { nickname, jobRoleName, last7Days, streak, scores } = home;
  // 서버가 한국 시간 기준으로 만든 last7Days 의 마지막 날이 오늘
  const today = last7Days[last7Days.length - 1].date;
  const [year, month, day] = today.split("-").map(Number);
  const weekday = WEEKDAY_NAMES[new Date(`${today}T00:00:00Z`).getUTCDay()];
  const answered = home.quests.answeredToday;
  const goals = buildGoals(home.quests);
  const doneCount = goals.filter((goal) => goal.current >= goal.total).length;

  return (
    <View style={styles.container}>
      <ScreenHeader>
        <Text style={styles.logo}>haru</Text>
        <Pressable style={styles.role} onPress={() => router.navigate("/profile")}>
          <Text style={styles.roleText}>{jobRoleName ?? "직무 선택"}</Text>
          <Image source={assets.v4ChevronDown} style={styles.roleIcon} />
        </Pressable>
      </ScreenHeader>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        {/* 오늘 날짜 일력 */}
        <View style={styles.pad}>
          <View style={styles.binding} />
          <View style={styles.sheet}>
            <Image source={assets.v4Perforation} style={styles.perforation} />
            <View style={styles.monthRow}>
              <Text style={styles.month}>{`${year}년 ${month}월`}</Text>
              <Text style={styles.weekday}>{weekday}</Text>
            </View>
            <View style={styles.dateRow}>
              <View style={styles.date}>
                <View style={styles.highlighter} />
                <Text style={styles.dateText}>{day}</Text>
              </View>
              {streak > 0 && (
                <View style={styles.streak}>
                  <Text style={styles.streakDays}>{`${streak}일`}</Text>
                  <Text style={styles.streakLabel}>연속</Text>
                </View>
              )}
            </View>
            <View style={styles.message}>
              <Text style={styles.messageTitle}>
                {answered
                  ? `${nickname}님, 오늘 답변을 마쳤어요.`
                  : `${nickname}님, 오늘의 질문을 아직 받지 않았어요.`}
              </Text>
              <Text style={styles.messageSub}>
                {answered
                  ? `내일도 답하면 ${streak + 1}일 연속이에요.`
                  : `오늘 답하면 ${streak + 1}일 연속이 돼요.`}
              </Text>
            </View>
            <Button
              label={answered ? "오늘 답변 보기" : "오늘 질문 받기"}
              onPress={() => router.navigate("/question")}
            />
          </View>
          <View style={[styles.pageEdge, styles.pageEdgeFirst]} />
          <View style={[styles.pageEdge, styles.pageEdgeSecond]} />
        </View>

        <View style={styles.spacer} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>지난 7일</Text>
        </View>
        <View style={styles.days}>
          {last7Days.map((item) => {
            const isToday = item.date === today;
            const date = Number(item.date.split("-")[2]);
            return (
              <View key={item.date} style={styles.dayColumn}>
                <Text style={isToday ? styles.dayNameToday : styles.dayName}>{item.day}</Text>
                <View
                  style={[
                    styles.dayBox,
                    item.status === "missed" && styles.dayBoxMissed,
                    isToday && styles.dayBoxToday,
                  ]}
                >
                  {item.status === "done" ? (
                    <>
                      <Text style={isToday ? styles.dayDateTodaySmall : styles.dayDateSmall}>
                        {date}
                      </Text>
                      <Image source={assets.v4Check} style={styles.dayCheck} />
                    </>
                  ) : isToday ? (
                    <>
                      <Text style={styles.dayDateToday}>{date}</Text>
                      <Text style={styles.dayTodayLabel}>오늘</Text>
                    </>
                  ) : (
                    <Text style={styles.dayDateMissed}>{date}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>최근 점수</Text>
          <Pressable onPress={() => router.navigate("/record")}>
            <Text style={styles.sectionLink}>기록 보기</Text>
          </Pressable>
        </View>
        <ScoreChart scores={scores} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>오늘의 목표</Text>
          <Text style={styles.sectionLink}>{`${goals.length}개 중 ${doneCount}개 완료`}</Text>
        </View>
        <View>
          {goals.map((goal, i) => (
            <View key={goal.title}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.goal}>
                <View style={styles.goalBox}>
                  <Image source={assets.v4Checkbox} style={styles.goalCheckbox} />
                  {goal.current >= goal.total && (
                    <Image source={assets.v4Check} style={styles.goalCheck} />
                  )}
                </View>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalCount}>{`${goal.current}/${goal.total}`}</Text>
              </View>
            </View>
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
      backgroundColor: colors.bg,
    },
    logo: {
      fontFamily: fonts.bold,
      fontSize: 22,
      letterSpacing: -0.22,
      color: colors.text,
    },
    role: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    roleText: {
      fontFamily: fonts.semibold,
      fontSize: 15,
      color: colors.text,
    },
    roleIcon: {
      width: 14,
      height: 14,
    },
    scroll: {
      flex: 1,
    },
    body: {
      gap: 14,
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing["2xl"],
    },

    // 일력
    pad: {
      alignItems: "center",
    },
    binding: {
      alignSelf: "stretch",
      height: 14,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: colors.accent,
    },
    sheet: {
      alignSelf: "stretch",
      paddingTop: spacing.lg,
      paddingHorizontal: 22,
      paddingBottom: 22,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.lineSoft,
      borderBottomLeftRadius: radius.sm,
      borderBottomRightRadius: radius.sm,
      backgroundColor: colors.surface,
    },
    perforation: {
      alignSelf: "center",
      width: 301,
      height: 8,
    },
    monthRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 14,
    },
    month: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.text,
    },
    weekday: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.textSub,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
    },
    date: {
      height: 128,
      justifyContent: "center",
    },
    // 날짜 아래쪽에 살짝 기울어진 형광펜 (다크에서는 투명)
    highlighter: {
      position: "absolute",
      left: -4,
      right: -4,
      top: 64,
      height: 46,
      borderRadius: radius.sm,
      backgroundColor: colors.highlighter,
      transform: [{ rotate: "-2deg" }],
    },
    dateText: {
      fontFamily: fonts.bold,
      fontSize: 128,
      lineHeight: 128,
      letterSpacing: -2.56,
      color: colors.text,
    },
    streak: {
      alignItems: "center",
      transform: [{ rotate: "6deg" }],
    },
    streakDays: {
      fontFamily: fonts.pen,
      fontSize: 44,
      lineHeight: 40,
      color: colors.accent,
    },
    streakLabel: {
      fontFamily: fonts.pen,
      fontSize: 22,
      lineHeight: 20,
      color: colors.accent,
    },
    message: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
      paddingBottom: 18,
    },
    messageTitle: {
      fontFamily: fonts.medium,
      fontSize: 16,
      color: colors.text,
    },
    messageSub: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textSub,
    },
    // 일력 아래에 겹쳐 보이는 종이 두 장
    pageEdge: {
      height: 4,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.line,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: colors.surface,
    },
    pageEdgeFirst: {
      alignSelf: "stretch",
      marginHorizontal: 6,
    },
    pageEdgeSecond: {
      alignSelf: "stretch",
      marginHorizontal: 12,
    },
    spacer: {
      height: 4,
    },

    // 섹션
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
    sectionLink: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textSub,
    },

    // 지난 7일
    days: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dayColumn: {
      alignItems: "center",
      gap: 6,
    },
    dayName: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.textSub,
    },
    dayNameToday: {
      fontFamily: fonts.bold,
      fontSize: 12,
      color: colors.text,
    },
    dayBox: {
      width: 42,
      height: 54,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.lineSoft,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
    },
    dayBoxMissed: {
      backgroundColor: colors.surfaceMuted,
    },
    dayBoxToday: {
      backgroundColor: colors.highlight,
    },
    dayDateSmall: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: colors.textFaint,
    },
    dayDateTodaySmall: {
      fontFamily: fonts.regular,
      fontSize: 11,
      color: colors.onHighlight,
    },
    dayCheck: {
      width: 26,
      height: 22,
    },
    dayDateMissed: {
      fontFamily: fonts.medium,
      fontSize: 16,
      color: colors.textFaint,
    },
    dayDateToday: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: colors.onHighlight,
    },
    dayTodayLabel: {
      fontFamily: fonts.medium,
      fontSize: 10,
      color: colors.onHighlight,
    },

    // 최근 점수
    chart: {
      height: CHART_HEIGHT,
    },
    chartBaseline: {
      position: "absolute",
      left: 0,
      right: 0,
      top: CHART_BASELINE,
      height: 1,
      backgroundColor: colors.chartBase,
    },
    dot: {
      position: "absolute",
      width: 8.5,
      height: 8.5,
      borderRadius: 4.25,
      borderWidth: 1.5,
      borderColor: colors.text,
      backgroundColor: colors.chartDot,
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
      fontSize: 22,
      lineHeight: 20,
      color: colors.textSub,
    },
    scoreLatest: {
      position: "absolute",
      width: 40,
      textAlign: "center",
      fontFamily: fonts.pen,
      fontSize: 30,
      lineHeight: 27,
      color: colors.accent,
    },
    chartDate: {
      position: "absolute",
      top: 128,
      width: 40,
      textAlign: "center",
      fontFamily: fonts.regular,
      fontSize: 11,
      color: colors.textFaint,
    },
    chartEmpty: {
      height: 96,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.lineSoft,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceMuted,
    },
    chartEmptyText: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textSub,
    },

    // 오늘의 목표
    goal: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: 14,
    },
    goalBox: {
      width: 22,
      height: 22,
    },
    goalCheckbox: {
      width: 22,
      height: 22,
    },
    // 다 한 목표는 체크박스 위에 손글씨 체크를 겹침
    goalCheck: {
      position: "absolute",
      left: 0,
      top: -4,
      width: 26,
      height: 22,
    },
    goalTitle: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 16,
      color: colors.text,
    },
    goalCount: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.textSub,
    },
    divider: {
      height: 1,
      backgroundColor: colors.line,
    },
  });

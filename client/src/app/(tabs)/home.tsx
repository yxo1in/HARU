import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { ChartFrame, ChartLabel, ChartPoint } from "@/components/chart-frame";
import { JobPill, StreakPill } from "@/components/header-pill";
import { QuestItem } from "@/components/quest-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { StreakDay } from "@/components/streak-day";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

// API 연동 전까지 쓰는 Figma 예시 데이터
const DAYS = [
  { day: "화", status: "missed" },
  { day: "수", status: "done" },
  { day: "목", status: "done" },
  { day: "금", status: "done" },
  { day: "토", status: "done" },
  { day: "일", status: "done" },
  { day: "월", status: "today" },
] as const;

const QUESTS = [
  { icon: require("@/assets/images/icons/quest-write.svg"), title: "답변 1개 쓰기", current: 0, total: 1 },
  { icon: require("@/assets/images/icons/quest-target.svg"), title: "80점 넘기기", current: 0, total: 1 },
  { icon: require("@/assets/images/icons/quest-calendar.svg"), title: "이번 주 답변 5개", current: 3, total: 5 },
];

const POINTS = [
  [20, 62],
  [72.81, 50],
  [125.61, 56],
  [178.42, 38],
  [231.22, 44],
];

export default function Home() {
  return (
    <View style={styles.container}>
      <ScreenHeader>
        <View style={styles.pills}>
          <JobPill job="백엔드" />
          <StreakPill days={5} />
        </View>
      </ScreenHeader>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            {"기진님,\n오늘도 한 번\n연습해볼까요?"}
          </Text>
          <Image
            source={require("@/assets/images/mascot/haru-home.png")}
            style={styles.haru}
          />
        </View>

        <Button label="연습 시작하기" onPress={() => router.navigate("/question")} />

        <View style={styles.section}>
          <SectionHeader title="지난 7일" />
          <View style={styles.days}>
            {DAYS.map((item) => (
              <StreakDay key={item.day} {...item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="점수 흐름"
            trailing="기록 보기"
            onPressTrailing={() => router.navigate("/record")}
          />
          <ChartFrame height={125}>
            <Image
              source={require("@/assets/images/chart/home-baseline.svg")}
              style={styles.baseline}
            />
            <Image
              source={require("@/assets/images/chart/home-line.svg")}
              style={styles.line}
            />
            {POINTS.map(([x, y]) => (
              <ChartPoint key={x} x={x} y={y} />
            ))}
            <ChartPoint x={282.21} y={24} latest />
            <ChartLabel x={298.6} y={20} text="86점" highlight />
            <ChartLabel x={21.82} y={42} text="62점" />
            <ChartLabel x={23.64} y={89} text="6회 전" />
            <ChartLabel x={277.2} y={89} text="최근" />
          </ChartFrame>
        </View>

        <View style={styles.section}>
          <View style={styles.goalsHeader}>
            <SectionHeader title="오늘의 목표" trailing="0/3 완료" />
          </View>
          {QUESTS.map((quest) => (
            <QuestItem key={quest.title} {...quest} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.bgSecondary,
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
    color: darkColors.textPrimary,
  },
  // 화면 폭이 달라도 오른쪽 기준으로 붙임 (PNG는 정수 크기로 내보내 원본보다 0.6 큼)
  haru: {
    position: "absolute",
    right: -25.4,
    top: 93.2,
    width: 159,
    height: 159,
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
    backgroundColor: darkColors.bgPrimary,
  },
  baseline: {
    position: "absolute",
    left: 23.64,
    top: 80.5,
    width: 264.03,
    height: 1,
  },
  line: {
    position: "absolute",
    left: 22.14,
    top: 28.5,
    width: 267.031,
    height: 39.0007,
  },
  goalsHeader: {
    paddingBottom: spacing.xs,
  },
});

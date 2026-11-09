import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { ChartFrame, ChartLabel, ChartPoint } from "@/components/chart-frame";
import { Chip } from "@/components/chip";
import { RecordItem } from "@/components/record-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

// API 연동 전까지 쓰는 Figma 예시 데이터
const CHIPS = ["전체", "자기소개", "지원동기", "인성", "기술"];

const RECORDS = [
  { meta: "지원동기, 오늘", question: "우리 회사에 지원한 이유는?", score: 88 },
  { meta: "인성, 10월 24일", question: "협업 중 갈등을 해결한 경험이 있나요?", score: 81 },
  { meta: "자기소개, 10월 23일", question: "1분 동안 자기소개를 해 주세요.", score: 86 },
  { meta: "기술, 10월 22일", question: "최근에 공부한 기술을 설명해 주세요.", score: 74 },
];

const GRID_LINES = [
  { y: 135, label: "60" },
  { y: 82, label: "80" },
  { y: 29, label: "100" },
];

const POINTS = [
  [46.26, 125],
  [83.89, 104],
  [121.52, 115],
  [159.15, 83],
  [195.91, 94],
  [233.54, 62],
  [271.18, 75],
];

function EmptyRecord() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="기록" />
      <View style={styles.empty}>
        <View style={styles.emptyMascot}>
          <Image
            source={require("@/assets/images/mascot/haru-empty.png")}
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
  // API 연동 전까지 빈 상태를 주소의 empty 값으로 구분함
  const { empty } = useLocalSearchParams<{ empty?: string }>();
  const [selectedChip, setSelectedChip] = useState("전체");

  if (empty) {
    return <EmptyRecord />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="기록" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.stats}>
          <View>
            <Text style={styles.average}>79점</Text>
            <Text style={styles.statLabel}>평균 점수</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.side}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>총 답변</Text>
              <Text style={styles.statValue}>24회</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>최고 점수</Text>
              <Text style={styles.statValue}>92점</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="점수 흐름" trailing="최근 8회" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={chip === selectedChip}
                onPress={() => setSelectedChip(chip)}
              />
            ))}
          </ScrollView>
          <ChartFrame height={211}>
            {GRID_LINES.map(({ y, label }) => (
              <View key={label}>
                <Image
                  source={require("@/assets/images/chart/record-grid.svg")}
                  style={[styles.grid, { top: y - 0.5 }]}
                />
                <ChartLabel x={20} y={y - 9} text={label} />
              </View>
            ))}
            <Image
              source={require("@/assets/images/chart/record-line.svg")}
              style={styles.line}
            />
            {POINTS.map(([x, y]) => (
              <ChartPoint key={x} x={x} y={y} />
            ))}
            <ChartPoint x={307.06} y={55} latest />
            <ChartLabel x={299.62} y={31} text="88점" highlight />
            <ChartLabel x={49.76} y={175} text="10월 15일" />
            <ChartLabel x={292.18} y={175} text="오늘" />
          </ChartFrame>
        </View>

        <View style={styles.section}>
          <SectionHeader title="전체 기록" />
          {RECORDS.map((item) => (
            <RecordItem
              key={item.meta}
              {...item}
              onPress={() => router.push("/record-detail")}
            />
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
    backgroundColor: darkColors.bgPrimary,
  },
  average: {
    ...typography.display,
    color: darkColors.textAccent,
  },
  statLabel: {
    ...typography.bodySmall,
    color: darkColors.textTertiary,
  },
  divider: {
    width: 1,
    height: 56,
    backgroundColor: darkColors.borderDefault,
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
    color: darkColors.textPrimary,
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
    left: 6.67,
    top: 0,
    width: 147,
    height: 147,
  },
  emptyTitle: {
    ...typography.h2,
    textAlign: "center",
    color: darkColors.textPrimary,
  },
  emptyText: {
    ...typography.bodyMedium,
    marginTop: spacing.sm,
    textAlign: "center",
    color: darkColors.textTertiary,
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
  line: {
    position: "absolute",
    left: 48.26,
    top: 59.5,
    width: 265.554,
    height: 71.0006,
  },
});

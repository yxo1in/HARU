import { StyleSheet, Text, View } from "react-native";
import { typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

type ScoreSummaryProps = {
  score: number;
  delta: string;
};

export function ScoreSummary({ score, delta }: ScoreSummaryProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>점수</Text>
      <View style={styles.line}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.unit}>점</Text>
        <View style={styles.delta}>
          <Text style={styles.deltaText}>{delta}</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: 2,
  },
  label: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  line: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  score: {
    ...typography.score,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  delta: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.bgSuccessSubtle,
  },
  deltaText: {
    ...typography.labelSmall,
    color: colors.textSuccess,
  },
});

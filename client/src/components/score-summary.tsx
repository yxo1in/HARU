import { StyleSheet, Text, View } from "react-native";
import { darkColors, typography } from "@/constants/theme";

type ScoreSummaryProps = {
  score: number;
  delta: string;
};

export function ScoreSummary({ score, delta }: ScoreSummaryProps) {
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

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: 2,
  },
  label: {
    ...typography.labelSmall,
    color: darkColors.textTertiary,
  },
  line: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  score: {
    ...typography.score,
    color: darkColors.textPrimary,
  },
  unit: {
    ...typography.h4,
    color: darkColors.textPrimary,
  },
  delta: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: darkColors.bgSuccessSubtle,
  },
  deltaText: {
    ...typography.labelSmall,
    color: darkColors.textSuccess,
  },
});

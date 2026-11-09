import { StyleSheet, Text, View } from "react-native";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

type RecordItemProps = {
  meta: string;
  question: string;
  score: number;
};

export function RecordItem({ meta, question, score }: RecordItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text style={styles.meta}>{meta}</Text>
        <Text style={styles.question} numberOfLines={1}>
          {question}
        </Text>
      </View>
      <View style={styles.score}>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreUnit}>점</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 72,
    padding: spacing.lg,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: darkColors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: darkColors.bgPrimary,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  meta: {
    ...typography.caption,
    color: darkColors.textTertiary,
  },
  question: {
    ...typography.labelLarge,
    color: darkColors.textPrimary,
  },
  score: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
  },
  scoreValue: {
    ...typography.h3,
    color: darkColors.textBrand,
  },
  scoreUnit: {
    ...typography.labelSmall,
    color: darkColors.textTertiary,
  },
});

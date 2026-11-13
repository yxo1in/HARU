import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

type RecordItemProps = {
  meta: string;
  question: string;
  score: number;
  onPress?: () => void;
};

export function RecordItem({ meta, question, score, onPress }: RecordItemProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable style={styles.container} disabled={!onPress} onPress={onPress}>
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
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 72,
    padding: spacing.lg,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  meta: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  question: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  score: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
  },
  scoreValue: {
    ...typography.h3,
    color: colors.textBrand,
  },
  scoreUnit: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
});

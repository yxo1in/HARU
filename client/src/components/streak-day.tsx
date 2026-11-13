import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

type StreakDayProps = {
  day: string;
  status: "done" | "today" | "missed";
};

export function StreakDay({ day, status }: StreakDayProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {status === "done" ? (
        <LinearGradient
          colors={[colors.mascotTop, colors.mascotMid, colors.mascotBottom]}
          locations={[0, 0.55, 1]}
          style={styles.dot}
        >
          <View style={[styles.eye, styles.eyeLeft]} />
          <View style={[styles.eye, styles.eyeRight]} />
        </LinearGradient>
      ) : (
        <View style={[styles.dot, status === "today" ? styles.today : styles.missed]} />
      )}
      <Text style={status === "today" ? styles.labelToday : styles.label}>{day}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  missed: {
    backgroundColor: colors.bgTertiary,
  },
  today: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.borderFocus,
    backgroundColor: colors.bgPrimary,
  },
  eye: {
    position: "absolute",
    top: 12,
    width: 4,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.mascotFace,
  },
  eyeLeft: {
    left: 12,
  },
  eyeRight: {
    left: 20,
  },
  label: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  labelToday: {
    ...typography.labelSmall,
    color: colors.textBrand,
  },
});

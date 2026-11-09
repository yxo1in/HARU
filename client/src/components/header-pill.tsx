import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

export function JobPill({ job }: { job: string }) {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  return (
    <View style={styles.pill}>
      <Image
        source={assets.job}
        style={styles.jobIcon}
      />
      <Text style={styles.jobLabel}>{job}</Text>
    </View>
  );
}

export function StreakPill({ days }: { days: number }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.pill}>
      <View style={styles.face}>
        <View style={[styles.eye, styles.eyeLeft]} />
        <View style={[styles.eye, styles.eyeRight]} />
      </View>
      <Text style={styles.streakLabel}>{days}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 34,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.full,
    backgroundColor: colors.bgPrimary,
  },
  jobIcon: {
    width: 19.92,
    height: 19.92,
  },
  jobLabel: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  face: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentStrong,
  },
  eye: {
    position: "absolute",
    top: 7,
    width: 3,
    height: 7,
    borderRadius: 1.5,
    backgroundColor: colors.mascotFace,
  },
  eyeLeft: {
    left: 7,
  },
  eyeRight: {
    left: 12,
  },
  streakLabel: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
});

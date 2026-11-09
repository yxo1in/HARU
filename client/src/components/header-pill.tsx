import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

export function JobPill({ job }: { job: string }) {
  return (
    <View style={styles.pill}>
      <Image
        source={require("@/assets/images/icons/job.svg")}
        style={styles.jobIcon}
      />
      <Text style={styles.jobLabel}>{job}</Text>
    </View>
  );
}

export function StreakPill({ days }: { days: number }) {
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

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 34,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: darkColors.borderDefault,
    borderRadius: radius.full,
    backgroundColor: darkColors.bgPrimary,
  },
  jobIcon: {
    width: 19.92,
    height: 19.92,
  },
  jobLabel: {
    ...typography.labelMedium,
    color: darkColors.textPrimary,
  },
  face: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: darkColors.accentStrong,
  },
  eye: {
    position: "absolute",
    top: 7,
    width: 3,
    height: 7,
    borderRadius: 1.5,
    backgroundColor: darkColors.mascotFace,
  },
  eyeLeft: {
    left: 7,
  },
  eyeRight: {
    left: 12,
  },
  streakLabel: {
    ...typography.labelLarge,
    color: darkColors.textPrimary,
  },
});

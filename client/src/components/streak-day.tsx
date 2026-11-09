import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { darkColors, spacing, typography } from "@/constants/theme";

type StreakDayProps = {
  day: string;
  status: "done" | "today" | "missed";
};

export function StreakDay({ day, status }: StreakDayProps) {
  return (
    <View style={styles.container}>
      {status === "done" ? (
        <LinearGradient
          colors={[darkColors.mascotTop, darkColors.mascotMid, darkColors.mascotBottom]}
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

const styles = StyleSheet.create({
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
    backgroundColor: darkColors.bgTertiary,
  },
  today: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: darkColors.borderFocus,
    backgroundColor: darkColors.bgPrimary,
  },
  eye: {
    position: "absolute",
    top: 12,
    width: 4,
    height: 10,
    borderRadius: 2,
    backgroundColor: darkColors.mascotFace,
  },
  eyeLeft: {
    left: 12,
  },
  eyeRight: {
    left: 20,
  },
  label: {
    ...typography.caption,
    color: darkColors.textTertiary,
  },
  labelToday: {
    ...typography.labelSmall,
    color: darkColors.textBrand,
  },
});

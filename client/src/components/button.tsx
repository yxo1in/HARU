import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "sm";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = "primary",
  size = "lg",
  onPress,
  style,
}: ButtonProps) {
  return (
    <Pressable
      style={[styles.base, styles[size], styles[variant], style]}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Text
        numberOfLines={1}
        style={[
          size === "lg" ? styles.labelLg : styles.labelSm,
          variant === "primary" && styles.labelPrimary,
          variant === "secondary" && styles.labelSecondary,
          variant === "ghost" && styles.labelGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  lg: {
    height: 56,
    paddingHorizontal: spacing["2xl"],
  },
  sm: {
    height: 48,
    minWidth: 120,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: darkColors.accentStrong,
  },
  secondary: {
    borderWidth: 1,
    borderColor: darkColors.borderStrong,
    backgroundColor: darkColors.bgPrimary,
  },
  ghost: {},
  labelLg: {
    ...typography.labelLarge,
  },
  labelSm: {
    ...typography.labelMedium,
  },
  labelPrimary: {
    color: darkColors.textOnAccent,
  },
  labelSecondary: {
    color: darkColors.textPrimary,
  },
  labelGhost: {
    color: darkColors.textBrand,
  },
});

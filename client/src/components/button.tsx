import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "sm";
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = "primary",
  size = "lg",
  disabled,
  onPress,
  style,
}: ButtonProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      style={[styles.base, styles[size], styles[variant], disabled && styles.disabled, style]}
      accessibilityRole="button"
      disabled={disabled}
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    backgroundColor: colors.actionDefault,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgPrimary,
  },
  ghost: {},
  disabled: {
    opacity: 0.4,
  },
  labelLg: {
    ...typography.labelLarge,
  },
  labelSm: {
    ...typography.labelMedium,
  },
  labelPrimary: {
    color: colors.textOnAccent,
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
  labelGhost: {
    color: colors.textBrand,
  },
});

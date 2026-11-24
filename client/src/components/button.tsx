import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { fonts, radius, spacing, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

// v4 버튼: primary(검정 채움) / secondary(테두리) / ghost(글자만) / danger(빨간 테두리)
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
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
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          size === "sm" && styles.labelSm,
          variant === "primary" && styles.labelPrimary,
          variant === "secondary" && styles.labelSecondary,
          variant === "ghost" && styles.labelGhost,
          variant === "danger" && styles.labelDanger,
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
    height: 54,
    paddingHorizontal: spacing.xl,
  },
  sm: {
    height: 44,
    minWidth: 120,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.buttonBg,
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.text,
    backgroundColor: colors.surface,
  },
  ghost: {},
  danger: {
    borderWidth: 1.5,
    borderColor: colors.danger,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
  labelSm: {
    fontSize: 14,
  },
  labelPrimary: {
    color: colors.buttonText,
  },
  labelSecondary: {
    color: colors.text,
  },
  labelGhost: {
    color: colors.textSub,
  },
  labelDanger: {
    color: colors.danger,
  },
});

import { Image, type ImageSource } from "expo-image";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet, Text } from "react-native";
import { darkColors, typography } from "@/constants/theme";

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: ImageSource;
  activeIcon: ImageSource;
};

export function TabButton({
  label,
  icon,
  activeIcon,
  isFocused,
  style: _style,
  ...props
}: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={styles.tab}
      accessibilityRole="tab"
      aria-selected={isFocused}
    >
      <Image source={isFocused ? activeIcon : icon} style={styles.icon} />
      <Text style={isFocused ? styles.labelActive : styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    width: 64,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    ...typography.caption,
    color: darkColors.textTertiary,
  },
  labelActive: {
    ...typography.labelSmall,
    color: darkColors.textBrand,
  },
});

import { Image, type ImageSource } from "expo-image";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet, Text } from "react-native";
import { typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

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
  const styles = useThemedStyles(createStyles);
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    color: colors.textTertiary,
  },
  labelActive: {
    ...typography.labelSmall,
    color: colors.textBrand,
  },
});

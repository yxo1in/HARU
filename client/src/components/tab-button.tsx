import { Image, type ImageSource } from "expo-image";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet, Text } from "react-native";
import { fonts, type ThemeColors } from "@/constants/theme";
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
  // 탭 4개가 남는 폭을 똑같이 나눠 가짐
  tab: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textFaint,
  },
  labelActive: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.accent,
  },
});

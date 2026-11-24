import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

// v4 탭 화면 상단: 왼쪽 굵은 제목, 오른쪽에 children (직무 선택 등)
const HEADER_HEIGHT = 56;

type ScreenHeaderProps = {
  title?: string;
  children?: ReactNode;
};

export function ScreenHeader({ title, children }: ScreenHeaderProps) {
  const styles = useThemedStyles(createStyles);
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top },
      ]}
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    letterSpacing: -0.48,
    color: colors.text,
  },
});

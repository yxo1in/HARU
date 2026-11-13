import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

const HEADER_HEIGHT = 64;

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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    backgroundColor: colors.bgHeader,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
});

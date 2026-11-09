import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { darkColors, spacing, typography } from "@/constants/theme";

const HEADER_HEIGHT = 52;

type ScreenHeaderProps = {
  title?: string;
  children?: ReactNode;
};

export function ScreenHeader({ title, children }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top },
      ]}
    >
      <StatusBar style="light" />
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.borderDefault,
    backgroundColor: darkColors.bgHeader,
  },
  title: {
    ...typography.h2,
    color: darkColors.textPrimary,
  },
});

import { Image, type ImageSource } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavBar } from "@/components/nav-bar";
import { darkColors, spacing, typography } from "@/constants/theme";

type StatusScreenProps = {
  mascot: ImageSource;
  mascotOverlay?: ReactNode;
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function StatusScreen({
  mascot,
  mascotOverlay,
  title,
  subtitle,
  children,
}: StatusScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NavBar />
      <View style={styles.body}>
        <View style={styles.mascotBox}>
          <Image source={mascot} style={styles.mascot} />
          {mascotOverlay}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children ? <View style={styles.actions}>{children}</View> : null}
      </View>
      <View style={[styles.homeArea, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.bgSecondary,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 128,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  mascotBox: {
    width: 209,
    height: 209,
  },
  mascot: {
    width: 209,
    height: 209,
  },
  title: {
    ...typography.h2,
    marginTop: 27,
    textAlign: "center",
    color: darkColors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    marginTop: spacing.sm,
    textAlign: "center",
    color: darkColors.textTertiary,
  },
  actions: {
    alignSelf: "stretch",
    gap: spacing.sm,
    marginTop: "auto",
  },
  homeArea: {
    backgroundColor: darkColors.bgPrimary,
  },
});

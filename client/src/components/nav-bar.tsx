import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

const NAV_HEIGHT = 56;

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}

export function NavBar({ title }: { title?: string }) {
  const styles = useThemedStyles(createStyles);
  const { assets, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { paddingTop: insets.top, height: NAV_HEIGHT + insets.top }]}
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Pressable
        style={styles.side}
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={goBack}
      >
        <Image
          source={assets.chevronLeft}
          style={styles.icon}
        />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.side} />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 6,
    paddingRight: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
    backgroundColor: colors.bgHeader,
  },
  side: {
    width: 44,
    height: 44,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
});

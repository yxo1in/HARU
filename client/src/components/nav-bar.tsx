import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

// v4 위쪽 바: 왼쪽 뒤로(<) 또는 닫기(X), 가운데 작은 제목, 오른쪽 자리(선택)
const NAV_HEIGHT = 48;

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}

type NavBarProps = {
  title?: string;
  icon?: "back" | "close" | "none"; // none: 아이콘 없이 제목만 (채점 중)
  onPress?: () => void;
  right?: ReactNode;
};

export function NavBar({ title, icon = "back", onPress = goBack, right }: NavBarProps) {
  const styles = useThemedStyles(createStyles);
  const { assets, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top, height: NAV_HEIGHT + insets.top }]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      {icon === "none" ? (
        <View style={styles.side} />
      ) : (
        <Pressable
          style={styles.side}
          accessibilityRole="button"
          accessibilityLabel={icon === "close" ? "닫기" : "뒤로가기"}
          onPress={onPress}
        >
          <Image source={icon === "close" ? assets.v4Close : assets.v4Back} style={styles.icon} />
        </Pressable>
      )}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.bg,
  },
  side: {
    minWidth: 44,
    height: 44,
    justifyContent: "center",
    paddingLeft: 10,
  },
  right: {
    alignItems: "flex-end",
    paddingLeft: 0,
    paddingRight: spacing.lg,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
});

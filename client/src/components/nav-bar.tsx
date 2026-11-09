import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { darkColors, spacing, typography } from "@/constants/theme";

const NAV_HEIGHT = 48;

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
}

export function NavBar({ title }: { title?: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { paddingTop: insets.top, height: NAV_HEIGHT + insets.top }]}
    >
      <StatusBar style="light" />
      <Pressable
        style={styles.side}
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={goBack}
      >
        <Image
          source={require("@/assets/images/icons/chevron-left.svg")}
          style={styles.icon}
        />
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 6,
    paddingRight: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.borderDefault,
    backgroundColor: darkColors.bgHeader,
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
    color: darkColors.textPrimary,
  },
});

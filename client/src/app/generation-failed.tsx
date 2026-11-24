import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { NavBar } from "@/components/nav-bar";
import { SmallPad } from "@/components/small-pad";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";

export default function GenerationFailed() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NavBar icon="close" onPress={() => router.navigate("/question")} />
      <View style={styles.body}>
        {/* 비어 있는 종이 + 손글씨 물음표 */}
        <SmallPad edges={false} padded={false} height={190}>
          <Image source={assets.v4BlankLines} style={styles.lines} />
          <Text style={styles.mark}>?</Text>
        </SmallPad>
        <Text style={styles.title}>질문을 만들지 못했어요</Text>
        <Text style={styles.subtitle}>
          {"AI 응답이 늦어 질문을 만들지 못했어요.\n다시 시도하거나, 미리 준비된 질문을 받아 보세요."}
        </Text>
      </View>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <Button label="다시 시도" style={styles.button} onPress={() => router.replace("/generating")} />
        <Button
          label="준비된 질문 받기"
          variant="secondary"
          style={styles.button}
          onPress={() => router.replace("/generating")}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: spacing.xl,
  },
  lines: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 300,
    height: 190,
  },
  mark: {
    position: "absolute",
    left: 214,
    top: 92,
    fontFamily: fonts.pen,
    fontSize: 80,
    lineHeight: 72,
    color: colors.accent,
    transform: [{ rotate: "6deg" }],
  },
  title: {
    marginTop: 36,
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: -0.22,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSub,
  },
  footer: {
    gap: 10,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
  },
  button: {
    alignSelf: "stretch",
  },
});

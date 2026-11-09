import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Haru } from "@/components/haru";
import { colors, radius, spacing, typography } from "@/constants/theme";

// Figma Hero(586)에서 상태바(54)를 뺀 높이
const HERO_CONTENT_HEIGHT = 532;

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.hero,
          { paddingTop: insets.top, height: HERO_CONTENT_HEIGHT + insets.top },
        ]}
      >
        <View style={styles.backgroundBlobs}>
          <Image
            source={require("@/assets/images/blob-violet.png")}
            style={styles.blob}
          />
        </View>
        <View style={styles.intro}>
          <Image
            source={require("@/assets/images/logo.svg")}
            style={styles.logo}
            accessibilityLabel="haru"
          />
          <View style={styles.headline}>
            <Text style={styles.headlineText}>
              {"하루 한 번,\n면접 연습."}
            </Text>
            <Image
              source={require("@/assets/images/doodle-underline.svg")}
              style={styles.doodleUnderline}
            />
          </View>
        </View>
        <View style={styles.mascot}>
          <View style={styles.haru}>
            <Haru />
          </View>
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>오늘 질문 준비해 뒀어요</Text>
          </View>
        </View>
      </View>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  hero: {
    backgroundColor: colors.bgSky,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 0,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  backgroundBlobs: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  blob: {
    width: 193,
    height: 270,
  },
  intro: {
    display: "flex",
    paddingTop: spacing["2xl"],
    paddingInline: spacing["xl"],
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing["xl"],
    alignSelf: "stretch",
  },
  logo: {
    width: 131.44,
    height: 49.6,
  },
  headline: {
    width: 177,
    height: 108,
  },
  headlineText: {
    ...typography.display,
    color: colors.textPrimary,
  },
  // SVG에 선 두께만큼 여백(1.75)이 있어서 Figma 위치(2, 96)에서 그만큼 당김
  doodleUnderline: {
    position: "absolute",
    left: 0.25,
    top: 94.25,
    width: 143.501,
    height: 12.5,
  },
  // Hero에서 Intro 아래 남은 영역 (Figma 318.4)
  mascot: {
    flex: 1,
    alignSelf: "stretch",
  },
  // 오른쪽·아래로 Hero 밖까지 나가고 잘림. 화면 폭이 달라도 오른쪽 기준으로 붙임
  haru: {
    position: "absolute",
    right: -40,
    top: 21,
  },
  // 164 × 36 말풍선을 6도 회전. 회전 전 기준 위치
  speechBubble: {
    position: "absolute",
    left: 21.67,
    top: 119.91,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bgInverse,
    transform: [{ rotate: "6deg" }],
  },
  speechBubbleText: {
    ...typography.labelMedium,
    color: colors.textInverse,
  },
});

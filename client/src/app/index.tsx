import { Image, type ImageSource } from "expo-image";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import {
  radius,
  spacing,
  typography,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { getToken } from "@/lib/token";
import { useState, useEffect } from "react";

const ACTIONS_CONTENT_HEIGHT = 231;

type SocialButtonProps = {
  icon: ImageSource;
  label: string;
  primary?: boolean;
  onPress: () => void;
};

function SocialButton({ icon, label, primary, onPress }: SocialButtonProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      style={[
        styles.social,
        primary ? styles.socialPrimary : styles.socialDefault,
      ]}
      accessibilityRole="button"
      onPress={onPress}
    >
      <Image source={icon} style={styles.socialIcon} />
      <Text style={primary ? styles.socialLabelPrimary : styles.socialLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Index() {
  const styles = useThemedStyles(createStyles);
  const { assets, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        router.replace("/home");
      } else {
        setChecked(true);
      }
    });
  }, []);

  if (!checked) return null;

  return (
    <View style={styles.container}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <View style={[styles.hero, { paddingTop: insets.top }]}>
        <Image source={assets.welcomeBlobs} style={styles.blobs} />
        <View style={styles.intro}>
          <Image
            source={assets.logo}
            style={styles.logo}
            accessibilityLabel="haru"
          />
          <View style={styles.headline}>
            <Text style={styles.headlineText}>{"하루 한 번,\n면접 연습."}</Text>
            <Image source={assets.doodle} style={styles.doodleUnderline} />
          </View>
        </View>
        <View style={styles.mascot}>
          <Image source={assets.haruWelcome} style={styles.haru} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>오늘 질문 준비해 뒀어요</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.actions,
          { height: ACTIONS_CONTENT_HEIGHT + insets.bottom },
        ]}
      >
        <SocialButton
          icon={assets.google}
          label="Google로 로그인"
          onPress={() => router.replace("/home")}
        />
        <SocialButton
          icon={assets.id}
          label="아이디로 로그인"
          primary
          onPress={() => router.push("/login")}
        />
        <Button
          label="처음이신가요? 회원가입"
          variant="ghost"
          size="sm"
          onPress={() => router.push("/signup")}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
    hero: {
      flex: 1,
      overflow: "hidden",
      backgroundColor: colors.bgSky,
    },
    // Figma에서 Hero 위로 110만큼 올라가 있는 번짐 배경
    blobs: {
      position: "absolute",
      left: 0,
      top: -110,
      width: 580,
      height: 696,
    },
    intro: {
      paddingTop: spacing["2xl"],
      paddingHorizontal: spacing.xl,
      gap: spacing.xl,
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
    mascot: {
      flex: 1,
    },
    // 화면 폭이 달라도 오른쪽 기준으로 붙임
    haru: {
      position: "absolute",
      right: -40,
      top: 44.4,
      width: 324,
      height: 324,
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
    actions: {
      alignItems: "center",
      gap: spacing.md,
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.xl,
    },
    social: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      alignSelf: "stretch",
      height: 56,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.full,
    },
    socialDefault: {
      backgroundColor: colors.bgPrimary,
      boxShadow: "0px 4px 8px rgba(0,0,0,0.08)",
    },
    socialPrimary: {
      backgroundColor: colors.actionDefault,
    },
    socialIcon: {
      width: 20,
      height: 20,
    },
    socialLabel: {
      ...typography.labelLarge,
      color: colors.textPrimary,
    },
    socialLabelPrimary: {
      ...typography.labelLarge,
      color: colors.textOnAccent,
    },
  });

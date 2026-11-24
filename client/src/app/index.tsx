import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { DailyPad } from "@/components/daily-pad";
import { ScoreCircle } from "@/components/score-circle";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { todayString } from "@/lib/records";
import { getToken } from "@/lib/token";

// 웰컴: 오늘 날짜 일력에 예시 질문과 점수를 보여주고, 아래에 로그인 버튼
export default function Index() {
  const styles = useThemedStyles(createStyles);
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(false);

  // 이미 로그인한 기기면 바로 홈으로
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.body, { paddingTop: insets.top + spacing.xl }]}
      >
        <Text style={styles.logo}>haru</Text>
        <View style={styles.padSpacer} />
        <DailyPad date={todayString()}>
          <View style={styles.sample}>
            <View style={styles.sampleText}>
              <Text style={styles.sampleLabel}>오늘의 질문</Text>
              <Text style={styles.sampleQuestion}>{"우리 회사에 지원한\n이유는 무엇인가요?"}</Text>
            </View>
            <ScoreCircle score={82} size={66} />
          </View>
        </DailyPad>
        <View style={styles.headlineSpacer} />
        <Text style={styles.headline}>{"하루 한 장씩,\n면접 질문에 답해요."}</Text>
        <Text style={styles.sub}>답변을 쓰면 빨간펜 첨삭과 점수를 받아요.</Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        {/* 구글 로그인은 아직 없어서 지금은 홈으로 바로 이동 */}
        <Button
          label="Google로 계속하기"
          style={styles.button}
          onPress={() => router.replace("/home")}
        />
        <Button
          label="아이디로 로그인"
          variant="secondary"
          style={styles.button}
          onPress={() => router.push("/login")}
        />
        <Pressable style={styles.signUp} accessibilityRole="button" onPress={() => router.push("/signup")}>
          <Text style={styles.signUpHint}>처음이라면</Text>
          <Text style={styles.signUpLink}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    scroll: {
      flex: 1,
    },
    body: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    logo: {
      fontFamily: fonts.bold,
      fontSize: 22,
      letterSpacing: -0.22,
      color: colors.text,
    },
    padSpacer: {
      height: 26,
    },
    sample: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: spacing.md,
      paddingTop: 10,
    },
    sampleText: {
      flex: 1,
      gap: spacing.xs,
    },
    sampleLabel: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.textSub,
    },
    sampleQuestion: {
      fontFamily: fonts.semibold,
      fontSize: 18,
      lineHeight: 25,
      letterSpacing: -0.18,
      color: colors.text,
    },
    headlineSpacer: {
      height: 34,
    },
    headline: {
      fontFamily: fonts.bold,
      fontSize: 30,
      lineHeight: 39,
      letterSpacing: -0.6,
      color: colors.text,
    },
    sub: {
      marginTop: 10,
      fontFamily: fonts.regular,
      fontSize: 16,
      lineHeight: 24,
      color: colors.textSub,
    },
    footer: {
      alignItems: "center",
      gap: 10,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.bg,
    },
    button: {
      alignSelf: "stretch",
    },
    signUp: {
      flexDirection: "row",
      gap: 6,
    },
    signUpHint: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textSub,
    },
    signUpLink: {
      fontFamily: fonts.semibold,
      fontSize: 14,
      color: colors.text,
    },
  });

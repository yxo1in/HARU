import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnswerSheet } from "@/components/answer-sheet";
import { NavBar } from "@/components/nav-bar";
import { GradingCircle } from "@/components/score-circle";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { MOCK_ANSWER, MOCK_QUESTION } from "@/lib/mock-answer";

// API 연동 전까지 채점이 끝난 것처럼 잠깐 보여주고 첨삭 결과로 넘어감
const MOCK_GRADING_MS = 2500;

export default function Grading() {
  const styles = useThemedStyles(createStyles);
  const { answer } = useLocalSearchParams<{ answer?: string }>();
  const text = answer ?? MOCK_ANSWER;

  useEffect(() => {
    const timer = setTimeout(
      () => router.replace({ pathname: "/feedback", params: { answer: text } }),
      MOCK_GRADING_MS,
    );
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <View style={styles.container}>
      {/* 채점 중에는 나가지 못하게 닫기 버튼이 없음 */}
      <NavBar icon="none" title={MOCK_QUESTION.category} />
      <ScrollView contentContainerStyle={styles.body}>
        <AnswerSheet
          category={MOCK_QUESTION.category}
          question={MOCK_QUESTION.text}
          answer={text}
          mark={<GradingCircle />}
        />
        <View style={styles.message}>
          <Text style={styles.title}>빨간펜으로 채점하고 있어요</Text>
          <Text style={styles.subtitle}>보통 10초 안에 끝나요. 길면 30초까지 걸려요.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  message: {
    alignItems: "center",
    gap: 6,
    marginTop: 38,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.2,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
});

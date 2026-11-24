import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnswerSheet } from "@/components/answer-sheet";
import { Button } from "@/components/button";
import { NavBar } from "@/components/nav-bar";
import { EmptyScoreCircle } from "@/components/score-circle";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { MOCK_ANSWER, MOCK_QUESTION } from "@/lib/mock-answer";

// 채점(AI)이 30초 안에 안 끝났을 때. 답변은 저장돼 있어서 같은 답변으로 다시 채점할 수 있음
export default function GradingFailed() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const insets = useSafeAreaInsets();
  const { answer } = useLocalSearchParams<{ answer?: string }>();
  const text = answer ?? MOCK_ANSWER;

  return (
    <View style={styles.container}>
      <NavBar
        icon="close"
        title={MOCK_QUESTION.category}
        onPress={() => router.navigate("/question")}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <AnswerSheet
          category={MOCK_QUESTION.category}
          question={MOCK_QUESTION.text}
          answer={text}
          mark={<EmptyScoreCircle />}
        >
          <View style={styles.saved}>
            <Image source={assets.v4CheckSm} style={styles.savedIcon} />
            <Text style={styles.savedText}>답변은 저장됐어요</Text>
          </View>
        </AnswerSheet>
        <View style={styles.message}>
          <Text style={styles.title}>채점을 마치지 못했어요</Text>
          <Text style={styles.subtitle}>
            {"AI 응답이 30초 안에 오지 않았어요.\n다시 채점을 누르면 같은 답변으로 다시 채점해요."}
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <Button
          label="다시 채점"
          style={styles.button}
          onPress={() => router.replace({ pathname: "/grading", params: { answer: text } })}
        />
        <Button
          label="나중에 기록에서 채점하기"
          variant="ghost"
          style={styles.button}
          onPress={() => router.navigate("/record")}
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
  scroll: {
    flex: 1,
  },
  body: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  saved: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  savedIcon: {
    width: 16,
    height: 16,
  },
  savedText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  message: {
    alignItems: "center",
    gap: 6,
    marginTop: 34,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.2,
    color: colors.text,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSub,
  },
  footer: {
    gap: spacing.xs,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
  },
  button: {
    alignSelf: "stretch",
  },
});

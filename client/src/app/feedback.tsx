import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnswerSheet } from "@/components/answer-sheet";
import { Button } from "@/components/button";
import { FeedbackMarks } from "@/components/feedback-marks";
import { NavBar } from "@/components/nav-bar";
import { ScoreCircle } from "@/components/score-circle";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { MOCK_ANSWER, MOCK_FEEDBACK, MOCK_QUESTION } from "@/lib/mock-answer";

// 첨삭 결과. 채점 API 연동 전까지 점수와 첨삭은 예시 데이터, 답변은 방금 쓴 글
export default function Feedback() {
  const styles = useThemedStyles(createStyles);
  const { answer } = useLocalSearchParams<{ answer?: string }>();
  const insets = useSafeAreaInsets();
  const feedback = MOCK_FEEDBACK;

  return (
    <View style={styles.container}>
      <NavBar icon="close" title="첨삭 결과" onPress={() => router.navigate("/question")} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <AnswerSheet
          category={MOCK_QUESTION.category}
          question={MOCK_QUESTION.text}
          answer={answer ?? MOCK_ANSWER}
          mark={<ScoreCircle score={feedback.score} size={78} />}
          belowQuestion={
            <View style={styles.delta}>
              <Text style={styles.deltaValue}>
                {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta}
              </Text>
              <Text style={styles.deltaText}>
                {`지난 정식 답변(${feedback.previous.date}, ${feedback.previous.score}점)보다 ${
                  feedback.delta >= 0 ? "올랐어요" : "내려갔어요"
                }`}
              </Text>
            </View>
          }
        >
          <View style={styles.divider} />
          <FeedbackMarks
            strength={feedback.strength}
            weakness={feedback.weakness}
            suggestion={feedback.suggestion}
          />
        </AnswerSheet>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <Text style={styles.retryHint}>재답변은 하루에 5번까지 할 수 있어요.</Text>
        <View style={styles.actions}>
          <Button
            label="같은 질문 다시 답하기"
            variant="secondary"
            style={styles.retry}
            onPress={() => router.replace("/answer")}
          />
          <Button label="완료" style={styles.done} onPress={() => router.navigate("/question")} />
        </View>
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
  delta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  deltaValue: {
    fontFamily: fonts.pen,
    fontSize: 30,
    lineHeight: 27,
    color: colors.accent,
  },
  deltaText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
  },
  retryHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSub,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  retry: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  done: {
    width: 96,
    paddingHorizontal: 0,
  },
});

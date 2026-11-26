import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnswerSheet } from "@/components/answer-sheet";
import { Button } from "@/components/button";
import { FeedbackMarks } from "@/components/feedback-marks";
import { NavBar } from "@/components/nav-bar";
import { EmptyScoreCircle, ScoreCircle } from "@/components/score-circle";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { CATEGORY_LABELS } from "@/lib/records";
import { deltaText, formatDelta, useAnswerDetail } from "@/lib/use-answer-detail";

// 첨삭 결과. 채점 화면이 넘겨준 답변 id 로 기록 상세를 불러와서 보여줌
export default function Feedback() {
  const styles = useThemedStyles(createStyles);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { detail, error } = useAnswerDetail(id);
  const close = () => router.navigate("/question");

  if (!detail) {
    return (
      <View style={styles.container}>
        <NavBar icon="close" title="첨삭 결과" onPress={close} />
        <Text style={styles.status}>
          {error || !id ? "첨삭을 불러오지 못했어요." : "불러오고 있어요"}
        </Text>
      </View>
    );
  }

  const { feedback } = detail;
  const label = CATEGORY_LABELS[detail.category];
  // 재답변은 항상 원본 답변에 붙임
  const originalId = detail.retryOfAnswerId ?? detail.id;
  const left = detail.retriesLeftToday;

  return (
    <View style={styles.container}>
      <NavBar icon="close" title="첨삭 결과" onPress={close} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <AnswerSheet
          category={detail.retryOfAnswerId ? `${label}, 재답변` : label}
          question={detail.question}
          answer={detail.content}
          mark={feedback ? <ScoreCircle score={feedback.score} size={78} /> : <EmptyScoreCircle />}
          belowQuestion={
            detail.delta !== null ? (
              <View style={styles.delta}>
                <Text style={styles.deltaValue}>{formatDelta(detail.delta)}</Text>
                <Text style={styles.deltaText}>{deltaText(detail)}</Text>
              </View>
            ) : undefined
          }
        >
          {feedback && (
            <>
              <View style={styles.divider} />
              <FeedbackMarks
                strength={feedback.strength}
                weakness={feedback.weakness}
                suggestion={feedback.suggestion}
              />
            </>
          )}
        </AnswerSheet>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <Text style={styles.retryHint}>
          {left > 0 ? `오늘 ${left}번 더 다시 답할 수 있어요.` : "오늘은 더 다시 답할 수 없어요."}
        </Text>
        <View style={styles.actions}>
          <Button
            label="같은 질문 다시 답하기"
            variant="secondary"
            style={styles.retry}
            disabled={left === 0}
            onPress={() =>
              router.replace({
                pathname: "/answer",
                params: {
                  questionId: String(detail.questionId),
                  category: detail.category,
                  content: detail.question,
                  retryOfAnswerId: String(originalId),
                },
              })
            }
          />
          <Button label="완료" style={styles.done} onPress={close} />
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
  status: {
    paddingTop: 48,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
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

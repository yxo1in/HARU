import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnswerSheet } from "@/components/answer-sheet";
import { Button } from "@/components/button";
import { FeedbackMarks } from "@/components/feedback-marks";
import { NavBar } from "@/components/nav-bar";
import { EmptyScoreCircle, ScoreCircle } from "@/components/score-circle";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { CATEGORY_LABELS, formatDate, formatDateTime } from "@/lib/records";
import { deltaText, formatDelta, retryDeltaText, useAnswerDetail } from "@/lib/use-answer-detail";

export default function RecordDetail() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { detail, error } = useAnswerDetail(id);

  if (!detail) {
    return (
      <View style={styles.container}>
        <NavBar title="기록" />
        <Text style={styles.status}>
          {error || !id ? "기록을 불러오지 못했어요." : "불러오고 있어요"}
        </Text>
      </View>
    );
  }

  const { feedback, retries } = detail;
  const isRetry = detail.retryOfAnswerId !== null;
  const label = CATEGORY_LABELS[detail.category];
  const originalId = detail.retryOfAnswerId ?? detail.id;
  const left = detail.retriesLeftToday;

  return (
    <View style={styles.container}>
      <NavBar title={`${formatDate(detail.answerDate)} ${isRetry ? "재답변" : "기록"}`} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <AnswerSheet
          category={`${label}, ${isRetry ? "재답변" : "정식 답변"}`}
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
          {feedback ? (
            <>
              <View style={styles.divider} />
              <FeedbackMarks
                strength={feedback.strength}
                weakness={feedback.weakness}
                suggestion={feedback.suggestion}
              />
            </>
          ) : (
            <Text style={styles.noFeedback}>
              {detail.feedbackStatus === "pending" ? "채점하고 있어요." : "아직 채점하지 못했어요."}
            </Text>
          )}
        </AnswerSheet>

        {!isRetry && (
          <View style={styles.retries}>
            <View style={styles.retryHeader}>
              <Text style={styles.retryTitle}>재답변</Text>
              <Text style={styles.retryMeta}>
                {left > 0 ? `오늘 ${left}번 더 할 수 있어요` : "오늘은 더 할 수 없어요"}
              </Text>
            </View>
            {retries.length === 0 && <Text style={styles.retryEmpty}>아직 재답변이 없어요</Text>}
            {retries.map((retry, i) => (
              <Pressable
                key={retry.id}
                style={styles.retryRow}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: "/record-detail", params: { id: String(retry.id) } })}
              >
                <View style={styles.retryText}>
                  <Text style={styles.retryName}>{`${i + 1}번째 재답변`}</Text>
                  <Text style={styles.retryDesc}>
                    {retry.delta === null
                      ? formatDateTime(retry.createdAt)
                      : `${formatDateTime(retry.createdAt)}, ${retryDeltaText(retry.delta)}`}
                  </Text>
                </View>
                <Text style={styles.retryScore}>{retry.score ?? "?"}</Text>
                <Image source={assets.v4ChevronRight} style={styles.chevron} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        {detail.feedbackStatus === "failed" ? (
          <Button
            label="다시 채점"
            onPress={() =>
              router.push({
                pathname: "/grading",
                params: {
                  answerId: String(detail.id),
                  category: detail.category,
                  content: detail.question,
                  answer: detail.content,
                },
              })
            }
          />
        ) : (
          <Button
            label="같은 질문 다시 답하기"
            disabled={left === 0}
            onPress={() =>
              router.push({
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
        )}
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
  noFeedback: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
  body: {
    gap: 20,
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
  retries: {
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  retryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
  },
  retryTitle: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    color: colors.text,
  },
  retryMeta: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
  retryEmpty: {
    paddingVertical: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
  retryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  retryText: {
    flex: 1,
    gap: 2,
  },
  retryName: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  retryDesc: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSub,
  },
  retryScore: {
    fontFamily: fonts.pen,
    fontSize: 40,
    lineHeight: 36,
    color: colors.accent,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  footer: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
  },
});

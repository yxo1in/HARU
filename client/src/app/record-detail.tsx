import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnswerSheet } from "@/components/answer-sheet";
import { Button } from "@/components/button";
import { FeedbackMarks } from "@/components/feedback-marks";
import { NavBar } from "@/components/nav-bar";
import { ScoreCircle } from "@/components/score-circle";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { MOCK_ANSWER, MOCK_FEEDBACK, MOCK_QUESTION } from "@/lib/mock-answer";

// 하루에 같은 질문을 다시 답할 수 있는 횟수
const RETRY_LIMIT = 5;

// 기록 상세 API(GET /api/answers/:id) 연동 전까지 쓰는 예시 데이터
const MOCK_RECORD = {
  date: "11월 23일",
  retries: [{ id: 1, time: "11월 23일 오후 3:40", score: 88, delta: 6 }],
};

export default function RecordDetail() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const insets = useSafeAreaInsets();
  const feedback = MOCK_FEEDBACK;
  const { retries } = MOCK_RECORD;
  const left = Math.max(RETRY_LIMIT - retries.length, 0);

  return (
    <View style={styles.container}>
      <NavBar title={`${MOCK_RECORD.date} 기록`} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <AnswerSheet
          category={`${MOCK_QUESTION.category}, 정식 답변`}
          question={MOCK_QUESTION.text}
          answer={MOCK_ANSWER}
          mark={<ScoreCircle score={feedback.score} size={78} />}
          belowQuestion={
            <View style={styles.delta}>
              <Text style={styles.deltaValue}>
                {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta}
              </Text>
              <Text style={styles.deltaText}>
                {feedback.delta >= 0 ? "지난 정식 답변보다 올랐어요" : "지난 정식 답변보다 내려갔어요"}
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

        <View style={styles.retries}>
          <View style={styles.retryHeader}>
            <Text style={styles.retryTitle}>재답변</Text>
            <Text style={styles.retryMeta}>
              {left > 0 ? `오늘 ${left}번 더 할 수 있어요` : "오늘은 더 할 수 없어요"}
            </Text>
          </View>
          {retries.length === 0 && <Text style={styles.retryEmpty}>아직 재답변이 없어요</Text>}
          {retries.map((retry, i) => (
            <Pressable key={retry.id} style={styles.retryRow} accessibilityRole="button">
              <View style={styles.retryText}>
                <Text style={styles.retryName}>{`${i + 1}번째 재답변`}</Text>
                <Text style={styles.retryDesc}>
                  {`${retry.time}, 원본보다 ${Math.abs(retry.delta)}점 ${retry.delta >= 0 ? "올랐어요" : "내려갔어요"}`}
                </Text>
              </View>
              <Text style={styles.retryScore}>{retry.score}</Text>
              <Image source={assets.v4ChevronRight} style={styles.chevron} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <Button
          label="같은 질문 다시 답하기"
          disabled={left === 0}
          onPress={() => router.push("/answer")}
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

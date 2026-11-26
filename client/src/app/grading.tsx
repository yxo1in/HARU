import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnswerSheet } from "@/components/answer-sheet";
import { Button } from "@/components/button";
import { NavBar } from "@/components/nav-bar";
import { GradingCircle } from "@/components/score-circle";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { postJson } from "@/lib/api";
import { CATEGORY_LABELS, type Category, type GradeResult } from "@/lib/records";

// 답변 화면에서 오면 questionId(+ 재답변이면 retryOfAnswerId)로 제출 + 채점,
// 채점 실패 화면에서 오면 answerId 로 같은 답변을 다시 채점
type GradingParams = {
  questionId?: string;
  retryOfAnswerId?: string;
  answerId?: string;
  category?: Category;
  content?: string;
  answer?: string;
};

export default function Grading() {
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams<GradingParams>();
  const { questionId, retryOfAnswerId, answerId, category, content, answer } = params;
  const [error, setError] = useState<string | null>(null);
  // 같은 화면에서 제출이 두 번 나가지 않게 막음 (정식 답변은 하루 1번이라 두 번째는 409)
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !category || !content || !answer) return;
    if (!answerId && !questionId) return;
    sent.current = true;

    const request = answerId
      ? postJson<GradeResult>(`/api/answers/${answerId}/feedback`, {})
      : postJson<GradeResult>("/api/answers", {
          questionId: Number(questionId),
          content: answer,
          ...(retryOfAnswerId ? { retryOfAnswerId: Number(retryOfAnswerId) } : {}),
        });

    request
      .then((result) => {
        if (!result) return;
        if (result.feedback) {
          router.replace({ pathname: "/feedback", params: { id: String(result.answer.id) } });
        } else {
          // 답변은 저장됐지만 채점만 실패 → 같은 답변으로 다시 채점할 수 있게 id 를 넘김
          router.replace({
            pathname: "/grading-failed",
            params: { answerId: String(result.answer.id), category, content, answer },
          });
        }
      })
      .catch((err: Error) => setError(err.message));
  }, [answerId, questionId, retryOfAnswerId, category, content, answer]);

  // 새로고침 등으로 내용 없이 들어오면 질문 탭으로
  if (!category || !content || !answer) {
    return <Redirect href="/question" />;
  }

  const label = CATEGORY_LABELS[category];

  // 답변 저장 자체가 안 된 경우 (이미 오늘 답함, 재답변 횟수 초과, 서버 오류 등)
  if (error) {
    return (
      <View style={styles.container}>
        <NavBar icon="close" title={label} onPress={() => router.navigate("/question")} />
        <ScrollView contentContainerStyle={styles.body}>
          <AnswerSheet category={label} question={content} answer={answer} mark={null} />
          <View style={styles.message}>
            <Text style={styles.title}>답변을 제출하지 못했어요</Text>
            <Text style={styles.subtitle}>{error}</Text>
          </View>
          <Button
            label="질문 탭으로"
            variant="secondary"
            style={styles.back}
            onPress={() => router.navigate("/question")}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 채점 중에는 나가지 못하게 닫기 버튼이 없음 */}
      <NavBar icon="none" title={label} />
      <ScrollView contentContainerStyle={styles.body}>
        <AnswerSheet category={label} question={content} answer={answer} mark={<GradingCircle />} />
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
    textAlign: "center",
    color: colors.textSub,
  },
  back: {
    marginTop: spacing.xl,
  },
});

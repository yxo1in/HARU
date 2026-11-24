import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";

// v4 답안지 카드: 유형 + 질문 (오른쪽에 점수 동그라미) / 아래에 파란 글씨 답변
// 채점 중, 채점 실패, 첨삭 결과, 기록 상세에서 같이 씀
type AnswerSheetProps = {
  category: string;
  question: string;
  answer: string;
  mark: ReactNode; // 오른쪽 동그라미 (점수 / 채점 중 / 점수 없음)
  belowQuestion?: ReactNode; // 질문 바로 아래 (점수 변화 +8)
  children?: ReactNode; // 답변 아래 (첨삭, "답변은 저장됐어요")
};

export function AnswerSheet({ category, question, answer, mark, belowQuestion, children }: AnswerSheetProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.sheet}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.question}>{question}</Text>
        </View>
        {mark}
      </View>
      {belowQuestion}
      {belowQuestion ? <View style={styles.divider} /> : null}
      <Text style={styles.answer}>{answer}</Text>
      {children}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  sheet: {
    gap: spacing.md,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headText: {
    flex: 1,
    gap: spacing.xs,
  },
  category: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  question: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: -0.18,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  answer: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 29,
    color: colors.ink,
  },
});

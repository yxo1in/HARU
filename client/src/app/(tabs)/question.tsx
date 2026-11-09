import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { JobPill } from "@/components/header-pill";
import { RecordItem } from "@/components/record-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

// API 연동 전까지 쓰는 Figma 예시 데이터
const TODAY_RESULT = {
  meta: "지원동기, 오늘",
  question: "우리 회사에 지원한 이유는 무엇인가요?",
  score: 82,
};

const PAST_QUESTIONS = [
  { meta: "자기소개, 10월 25일", question: "1분 동안 자기소개를 해 주세요.", score: 78 },
  { meta: "인성, 10월 24일", question: "협업 중 갈등을 해결한 경험이 있나요?", score: 86 },
  { meta: "기술, 10월 22일", question: "최근에 공부한 기술을 설명해 주세요.", score: 71 },
];

export default function Question() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="질문">
        <JobPill job="백엔드" />
      </ScreenHeader>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.start}>
          <View style={styles.intro}>
            <Text style={styles.title}>{"오늘 답변은\n끝났어요"}</Text>
            <Text style={styles.subtitle}>내일 0시에 새 질문이 열려요</Text>
          </View>
          <RecordItem {...TODAY_RESULT} />
          <Pressable style={styles.retryButton} accessibilityRole="button">
            <Text style={styles.retryLabel}>같은 질문 다시 답하기</Text>
          </Pressable>
        </View>

        <View style={styles.past}>
          <SectionHeader title="지난 질문" trailing="전체 보기" />
          {PAST_QUESTIONS.map((item) => (
            <RecordItem key={item.meta} {...item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.bgSecondary,
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: spacing["2xl"],
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  start: {
    gap: spacing.xl,
  },
  intro: {
    gap: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: darkColors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: darkColors.textTertiary,
  },
  retryButton: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    borderWidth: 1,
    borderColor: darkColors.borderStrong,
    borderRadius: radius.md,
    backgroundColor: darkColors.bgPrimary,
  },
  retryLabel: {
    ...typography.labelLarge,
    color: darkColors.textPrimary,
  },
  past: {
    gap: spacing.md,
  },
});

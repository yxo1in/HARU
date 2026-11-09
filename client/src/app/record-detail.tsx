import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { FeedbackList } from "@/components/feedback-list";
import { NavBar } from "@/components/nav-bar";
import { ScoreSummary } from "@/components/score-summary";
import { SectionHeader } from "@/components/section-header";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

export default function RecordDetail() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <View style={styles.question}>
          <View style={styles.meta}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>지원동기</Text>
            </View>
            <Text style={styles.date}>10월 27일 오후 3:24</Text>
          </View>
          <Text style={styles.title}>{"우리 회사에 지원한\n이유는 무엇인가요?"}</Text>
        </View>

        <ScoreSummary score={88} delta="지난번보다 +7" />

        <View style={styles.section}>
          <SectionHeader title="내 답변" />
          <View style={styles.card}>
            <Text style={styles.answer}>
              저는 사람들이 매일 쓰는 서비스를 만들고 싶어서 지원했습니다. 특히 귀사의 추천
              기능을 쓰면서 개발자로 참여하고 싶다고 느꼈어요.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="피드백" />
          <View style={styles.card}>
            <FeedbackList />
          </View>
        </View>

        <Button
          label="같은 질문 다시 답하기"
          variant="secondary"
          onPress={() => router.push("/answer")}
        />
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
  },
  question: {
    gap: spacing.md,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: darkColors.bgBrandSubtle,
  },
  badgeText: {
    ...typography.labelSmall,
    color: darkColors.textBrand,
  },
  date: {
    ...typography.labelSmall,
    color: darkColors.textTertiary,
  },
  title: {
    ...typography.h2,
    color: darkColors.textPrimary,
  },
  section: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: darkColors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: darkColors.bgPrimary,
  },
  answer: {
    ...typography.bodyMedium,
    color: darkColors.textPrimary,
  },
});

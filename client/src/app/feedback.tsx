import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { HaruBubble, HaruMessages, MyBubble, QuestionBubble } from "@/components/chat-bubble";
import { FeedbackList } from "@/components/feedback-list";
import { NavBar } from "@/components/nav-bar";
import { ScoreSummary } from "@/components/score-summary";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

// 답변 없이 이 화면을 바로 열었을 때 보여주는 Figma 예시 답변
const SAMPLE_ANSWER =
  "저는 사람들이 매일 쓰는 서비스를 만들고 싶어서 지원했습니다. 특히 귀사의 추천 기능을 쓰면서 개발자로 참여하고 싶다고 느꼈어요.";

export default function Feedback() {
  const styles = useThemedStyles(createStyles);
  const { answer } = useLocalSearchParams<{ answer?: string }>();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <NavBar title="지원동기 면접" />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <Text style={styles.date}>오늘 오후 3:20</Text>
        <HaruMessages time="오후 3:20">
          <QuestionBubble
            category="지원동기 질문"
            text={"우리 회사에 지원한\n이유는 무엇인가요?"}
          />
        </HaruMessages>
        <MyBubble text={answer ?? SAMPLE_ANSWER} time="오후 3:24" />
        <HaruMessages>
          <HaruBubble text="피드백을 정리했어요" />
          <View style={styles.card}>
            <ScoreSummary score={82} delta="+8" />
            <View style={styles.divider} />
            <FeedbackList />
          </View>
        </HaruMessages>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="같은 질문 다시 답하기"
          variant="secondary"
          style={styles.action}
          onPress={() => router.replace("/answer")}
        />
        <Button
          label="완료"
          style={styles.action}
          onPress={() => router.dismissTo("/question?done=1")}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  scroll: {
    flex: 1,
  },
  messages: {
    flexGrow: 1,
    justifyContent: "flex-end",
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  date: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textTertiary,
  },
  card: {
    alignSelf: "stretch",
    gap: spacing.lg,
    padding: spacing.lg,
    borderTopLeftRadius: 6,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
    boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDefault,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    backgroundColor: colors.bgPrimary,
  },
  // 버튼 폭이 좁아서 긴 문구가 잘리지 않게 좌우 여백을 줄임
  action: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
});

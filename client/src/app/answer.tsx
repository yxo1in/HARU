import { Image } from "expo-image";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { NavBar } from "@/components/nav-bar";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, noWebOutline, spacing, type ThemeColors } from "@/constants/theme";
import { CATEGORY_LABELS, todayString, type Category } from "@/lib/records";

const MAX_LENGTH = 1000;
// 공책 한 줄 높이. 글자 줄 간격과 밑줄 간격을 같게 맞춤
const LINE_HEIGHT = 30;
const LINE_COUNT = 10;
const WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

// 질문은 생성 중 화면(generating)이 만들어서 params 로 넘겨줌
// 재답변이면 retryOfAnswerId(원본 답변 id)도 같이 옴
type AnswerParams = {
  questionId?: string;
  category?: Category;
  content?: string;
  retryOfAnswerId?: string;
};

export default function Answer() {
  const styles = useThemedStyles(createStyles);
  const { assets, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { questionId, category, content, retryOfAnswerId } = useLocalSearchParams<AnswerParams>();
  const [answer, setAnswer] = useState("");
  const trimmedAnswer = answer.trim();

  const today = todayString();
  const [, month, day] = today.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(`${today}T00:00:00Z`).getUTCDay()];

  // 새로고침 등으로 질문 없이 들어오면 질문 탭으로 돌려보냄
  if (!questionId || !category || !content) {
    return <Redirect href="/question" />;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <NavBar
        icon="close"
        onPress={() => router.navigate("/question")}
        title={CATEGORY_LABELS[category]}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheet}>
          <Text style={styles.date}>{`${month}월 ${day}일 ${weekday}의 질문`}</Text>
          <Text style={styles.question}>{content}</Text>
          {/* 공책 줄 위에 파란 글씨로 쓰는 칸 */}
          <View style={styles.writing}>
            {Array.from({ length: LINE_COUNT }, (_, i) => (
              <View key={i} style={[styles.rule, { top: LINE_HEIGHT * (i + 1) - 1 }]} />
            ))}
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="여기에 답변을 적어 주세요"
              placeholderTextColor={colors.textFaint}
              maxLength={MAX_LENGTH}
              multiline
              scrollEnabled
            />
          </View>
        </View>

        {/* 재답변은 같은 질문에 다시 답하는 거라 질문을 바꿀 수 없음 */}
        {!retryOfAnswerId && (
          <>
            <Pressable
              style={styles.other}
              accessibilityRole="button"
              onPress={() => router.replace({ pathname: "/generating", params: { category } })}
            >
              <Image source={assets.v4Refresh} style={styles.otherIcon} />
              <Text style={styles.otherText}>다른 질문 받기</Text>
            </Pressable>
            <Text style={styles.otherHint}>제출하기 전에는 다른 질문으로 바꿀 수 있어요.</Text>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <View style={styles.count}>
          <Text style={styles.countValue}>{`${answer.length} / ${MAX_LENGTH}자`}</Text>
          <Text style={styles.countHint}>{`${MAX_LENGTH}자까지 쓸 수 있어요`}</Text>
        </View>
        <Button
          label="제출하고 채점받기"
          style={styles.submit}
          disabled={!trimmedAnswer}
          onPress={() =>
            router.replace({
              pathname: "/grading",
              params: {
                questionId,
                category,
                content,
                answer: trimmedAnswer,
                ...(retryOfAnswerId ? { retryOfAnswerId } : {}),
              },
            })
          }
        />
      </View>
    </KeyboardAvoidingView>
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
  sheet: {
    gap: 14,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  question: {
    fontFamily: fonts.bold,
    fontSize: 25,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.text,
  },
  writing: {
    height: LINE_HEIGHT * LINE_COUNT,
  },
  rule: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.rule,
  },
  input: {
    height: LINE_HEIGHT * LINE_COUNT,
    padding: 0,
    marginTop: -4,
    fontFamily: fonts.regular,
    fontSize: 17,
    lineHeight: LINE_HEIGHT,
    color: colors.ink,
    textAlignVertical: "top",
    ...noWebOutline,
  },
  other: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: spacing.md,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },
  otherIcon: {
    width: 18,
    height: 18,
  },
  otherText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  otherHint: {
    marginLeft: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
  },
  count: {
    gap: 2,
  },
  countValue: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  countHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSub,
  },
  submit: {
    width: 168,
    height: 52,
    paddingHorizontal: 0,
  },
});

import { Image } from "expo-image";
import { router } from "expo-router";
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
import { HaruBubble, HaruMessages, QuestionBubble } from "@/components/chat-bubble";
import { Chip } from "@/components/chip";
import { NavBar } from "@/components/nav-bar";
import { darkColors, fontFamily, radius, spacing, typography } from "@/constants/theme";

const MAX_LENGTH = 1000;
// API 연동 전까지 쓰는 Figma 예시 답변
const SAMPLE_ANSWER = "저는 사람들이 매일 쓰는 서비스를 만들고 싶어서 지원했습니다. 특히 귀사의";

export default function Answer() {
  const insets = useSafeAreaInsets();
  const [answer, setAnswer] = useState(SAMPLE_ANSWER);
  const [tipSelected, setTipSelected] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <NavBar title="지원동기 면접" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.messages}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.date}>오늘 오후 3:20</Text>
        <HaruMessages time="오후 3:20">
          <HaruBubble text={"백엔드 직무에 맞는\n지원동기 질문을 준비했어요."} />
          <QuestionBubble
            category="지원동기 질문"
            text={"우리 회사에 지원한\n이유는 무엇인가요?"}
          />
        </HaruMessages>
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.quickActions}>
          <Chip
            label="답변 팁 보기"
            selected={tipSelected}
            onPress={() => setTipSelected((value) => !value)}
          />
          <Chip label="다른 질문 받기" onPress={() => router.replace("/generating")} />
        </View>
        <View style={styles.inputRow}>
          <View style={styles.field}>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              maxLength={MAX_LENGTH}
              multiline
            />
            <Text style={styles.counter}>
              {answer.length} / {MAX_LENGTH}
            </Text>
          </View>
          <Pressable
            style={styles.send}
            accessibilityRole="button"
            accessibilityLabel="답변 보내기"
            onPress={() => router.replace("/feedback")}
          >
            <Image source={require("@/assets/images/icons/send.svg")} style={styles.sendIcon} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  messages: {
    gap: spacing.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  date: {
    ...typography.caption,
    textAlign: "center",
    color: darkColors.textTertiary,
  },
  composer: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: darkColors.borderDefault,
    backgroundColor: darkColors.bgPrimary,
  },
  quickActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  field: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: darkColors.borderFocus,
    borderRadius: radius.lg,
    backgroundColor: darkColors.bgSecondary,
  },
  input: {
    minHeight: 48,
    maxHeight: 120,
    padding: 0,
    fontFamily: fontFamily.base,
    fontSize: 16,
    lineHeight: 24,
    color: darkColors.textPrimary,
    textAlignVertical: "top",
    outlineWidth: 0,
  },
  counter: {
    ...typography.caption,
    textAlign: "right",
    color: darkColors.textTertiary,
  },
  send: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: darkColors.accentStrong,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});

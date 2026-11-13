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
import { fontFamily, noWebOutline, radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

const MAX_LENGTH = 1000;

export default function Answer() {
  const styles = useThemedStyles(createStyles);
  const { assets, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [answer, setAnswer] = useState("");
  const trimmedAnswer = answer.trim();
  const [tipSelected, setTipSelected] = useState(false);
  const [focused, setFocused] = useState(false);

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
          <View style={[styles.field, focused && styles.fieldFocused]}>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="답변을 입력해 주세요"
              placeholderTextColor={colors.textTertiary}
              maxLength={MAX_LENGTH}
              multiline
            />
            <Text style={styles.counter}>
              {answer.length} / {MAX_LENGTH}
            </Text>
          </View>
          <Pressable
            style={[styles.send, !trimmedAnswer && styles.sendDisabled]}
            accessibilityRole="button"
            accessibilityLabel="답변 보내기"
            disabled={!trimmedAnswer}
            onPress={() =>
              router.replace({ pathname: "/feedback", params: { answer: trimmedAnswer } })
            }
          >
            <Image source={assets.send} style={styles.sendIcon} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    gap: spacing.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  date: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textTertiary,
  },
  composer: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    backgroundColor: colors.bgPrimary,
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
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSecondary,
  },
  fieldFocused: {
    borderColor: colors.borderFocus,
  },
  input: {
    minHeight: 48,
    maxHeight: 120,
    padding: 0,
    fontFamily: fontFamily.base,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlignVertical: "top",
    ...noWebOutline,
  },
  counter: {
    ...typography.caption,
    textAlign: "right",
    color: colors.textTertiary,
  },
  send: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.actionDefault,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});

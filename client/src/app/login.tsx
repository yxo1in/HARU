import { router } from "expo-router";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { NavBar } from "@/components/nav-bar";
import { TextField } from "@/components/text-field";
import { spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

export default function Login() {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <NavBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>아이디로 로그인</Text>
        <View style={styles.form}>
          <TextField label="아이디" placeholder="아이디 입력" autoCapitalize="none" />
          <TextField label="비밀번호" placeholder="비밀번호 입력" secure />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button label="로그인" onPress={() => router.replace("/home")} style={styles.submit} />
        <Pressable style={styles.signUp} onPress={() => router.replace("/signup")}>
          <Text style={styles.signUpHint}>처음이신가요?</Text>
          <Text style={styles.signUpLink}>회원가입</Text>
        </Pressable>
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
  body: {
    gap: 48,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  form: {
    gap: spacing.xl,
  },
  footer: {
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  submit: {
    alignSelf: "stretch",
  },
  signUp: {
    flexDirection: "row",
    gap: 6,
  },
  signUpHint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  signUpLink: {
    ...typography.labelMedium,
    color: colors.textBrand,
  },
});

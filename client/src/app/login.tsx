import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { NavBar } from "@/components/nav-bar";
import { TextField } from "@/components/text-field";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";
import { useState } from "react";
import { saveToken } from "@/lib/token";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId,
          password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      await saveToken(data.accessToken);
      router.replace("/home");
    } catch {
      setError("서버 연결 실패");
    } finally {
      setLoading(false);
    }
  };

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
          <TextField
            label="아이디"
            placeholder="아이디 입력"
            autoCapitalize="none"
            onChangeText={setLoginId}
          />
          <TextField
            label="비밀번호"
            placeholder="비밀번호 입력"
            secure
            onChangeText={setPassword}
            // 로그인 실패 문구는 비밀번호 칸 아래에 빨갛게
            state={error ? "error" : "default"}
            helper={error || undefined}
          />
        </View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.md }]}
      >
        <Button
          label="로그인"
          onPress={handleLogin}
          style={styles.submit}
          disabled={loading}
        />
        <Pressable style={styles.signUp} accessibilityRole="button" onPress={() => router.push("/signup")}>
          <Text style={styles.signUpHint}>처음이라면</Text>
          <Text style={styles.signUpLink}>회원가입</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    scroll: {
      flex: 1,
    },
    body: {
      gap: spacing.sm,
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: 28,
      letterSpacing: -0.56,
      color: colors.text,
    },
    form: {
      gap: 18,
      paddingTop: 28,
    },
    footer: {
      alignItems: "center",
      gap: spacing.lg,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.bg,
    },
    submit: {
      alignSelf: "stretch",
    },
    signUp: {
      flexDirection: "row",
      gap: 6,
    },
    signUpHint: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textSub,
    },
    signUpLink: {
      fontFamily: fonts.semibold,
      fontSize: 14,
      color: colors.text,
    },
  });

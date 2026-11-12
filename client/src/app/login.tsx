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
import { spacing, typography, type ThemeColors } from "@/constants/theme";
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
          />
        </View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Button
          label="로그인"
          onPress={handleLogin}
          style={styles.submit}
          disabled={loading}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.signUp} onPress={() => router.push("/signup")}>
          <Text style={styles.signUpHint}>처음이신가요?</Text>
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
    error: {
      ...typography.caption,
      color: colors.textDanger,
    },
  });

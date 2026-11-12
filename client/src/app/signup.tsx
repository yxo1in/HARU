import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { NavBar } from "@/components/nav-bar";
import { TextField } from "@/components/text-field";
import { JOB_ROLE_NAMES, JOBS } from "@/constants/jobs";
import { spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function fetchJobRoleId(job: string) {
  const res = await fetch(`${API_URL}/api/job-roles`);
  if (!res.ok) {
    throw new Error("직무 목록을 불러오지 못했어요.");
  }
  const { jobRoles }: { jobRoles: { id: number; name: string }[] } = await res.json();
  return jobRoles.find(({ name }) => name === JOB_ROLE_NAMES[job])?.id ?? null;
}

export default function SignUp() {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [job, setJob] = useState<string | null>("백엔드");

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const jobRoleId = job ? await fetchJobRoleId(job) : null;
      const res = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login_id: loginId,
            password : password,
            nickname : nickname,
            job_role_id: jobRoleId,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      router.replace("/home");
    } catch {
      setError("서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
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
        <Text style={styles.title}>몇 가지만 알려 주세요</Text>
        <View style={styles.form}>
          <TextField
            label="아이디"
            placeholder="영문, 숫자 4~20자"
            autoCapitalize="none"
            value={loginId}
            onChangeText={setLoginId}
          />
          <TextField
            label="비밀번호"
            placeholder="비밀번호 입력"
            helper="8자 이상, 영문과 숫자를 섞어 주세요"
            secure
            value={password}
            onChangeText={setPassword}
          />
          <TextField
            label="닉네임"
            placeholder="2~10자로 입력"
            value={nickname}
            onChangeText={setNickname}
          />
          <View style={styles.jobRole}>
            <Text style={styles.jobLabel}>희망 직무 (선택)</Text>
            <View style={styles.chips}>
              {JOBS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={item === job}
                  onPress={() => setJob(item === job ? null : item)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          label="가입하기"
          onPress={handleSignUp}
          disabled={loading}
          style={styles.submit}
        />
        <Text style={styles.terms}>
          가입하면 이용약관과 개인정보 처리방침에 동의하게 돼요.
        </Text>
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
      gap: spacing["2xl"],
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.xl,
    },
    title: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    form: {
      gap: spacing.xl,
    },
    jobRole: {
      gap: spacing.sm,
    },
    jobLabel: {
      ...typography.labelMedium,
      color: colors.textSecondary,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
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
    terms: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    error: {
      ...typography.caption,
      color: colors.textDanger,
    },
  });

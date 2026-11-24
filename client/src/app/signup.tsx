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
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Field = "loginId" | "password" | "nickname";

async function fetchJobRoleId(job: string) {
  const res = await fetch(`${API_URL}/api/job-roles`);
  if (!res.ok) {
    throw new Error("직무 목록을 불러오지 못했어요.");
  }
  const { jobRoles }: { jobRoles: { id: number; name: string }[] } = await res.json();
  return jobRoles.find(({ name }) => name === JOB_ROLE_NAMES[job])?.id ?? null;
}

// 서버 오류 문구에 칸 이름이 들어 있으면 그 칸 아래에 빨갛게 보여줌
function fieldOf(message: string): Field | null {
  if (message.includes("아이디")) return "loginId";
  if (message.includes("비밀번호")) return "password";
  if (message.includes("닉네임")) return "nickname";
  return null;
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
  const errorField = error ? fieldOf(error) : null;

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
      router.replace("/login");
    } catch {
      setError("서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const fieldState = (field: Field) => (errorField === field ? "error" : "default");

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <NavBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>회원가입</Text>
        <View style={styles.form}>
          <TextField
            label="아이디"
            placeholder="영문 소문자, 숫자 4~20자"
            autoCapitalize="none"
            value={loginId}
            onChangeText={setLoginId}
            state={fieldState("loginId")}
            helper={errorField === "loginId" ? error : undefined}
          />
          <TextField
            label="비밀번호"
            placeholder="비밀번호 입력"
            helper={
              errorField === "password" ? error : "8~64자, 영문과 숫자를 하나 이상 넣어 주세요."
            }
            secure
            value={password}
            onChangeText={setPassword}
            state={fieldState("password")}
          />
          <TextField
            label="닉네임"
            placeholder="2~10자로 입력"
            value={nickname}
            onChangeText={setNickname}
            state={fieldState("nickname")}
            helper={errorField === "nickname" ? error : undefined}
          />
          <View style={styles.jobRole}>
            <View style={styles.jobLabelRow}>
              <Text style={styles.jobLabel}>희망 직무</Text>
              <Text style={styles.jobOptional}>선택</Text>
            </View>
            <View style={styles.chips}>
              {JOBS.map((item) => (
                <Chip
                  key={item}
                  label={JOB_ROLE_NAMES[item]}
                  selected={item === job}
                  onPress={() => setJob(item === job ? null : item)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}
      >
        {/* 칸과 상관없는 오류(서버 연결 등)만 버튼 위에 */}
        {error && !errorField ? <Text style={styles.error}>{error}</Text> : null}
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
      backgroundColor: colors.bg,
    },
    scroll: {
      flex: 1,
    },
    body: {
      gap: 6,
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: 28,
      letterSpacing: -0.56,
      color: colors.text,
    },
    form: {
      gap: 14,
      paddingTop: 18,
    },
    jobRole: {
      gap: 10,
    },
    jobLabelRow: {
      flexDirection: "row",
      gap: 6,
    },
    jobLabel: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.text,
    },
    jobOptional: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textFaint,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    footer: {
      alignItems: "center",
      gap: 10,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.bg,
    },
    submit: {
      alignSelf: "stretch",
    },
    terms: {
      fontFamily: fonts.regular,
      fontSize: 12,
      color: colors.textSub,
    },
    error: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.danger,
    },
  });

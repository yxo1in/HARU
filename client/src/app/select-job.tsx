import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { useThemedStyles } from "@/components/theme-provider";
import { JOB_ROLE_NAMES, JOBS } from "@/constants/jobs";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { getToken, removeToken } from "@/lib/token";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// 구글로 처음 가입한 회원이 직무를 고르는 화면. 질문 생성에 직무가 꼭 필요해서 홈 전에 거침
export default function SelectJob() {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [job, setJob] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!job) return;
    setSaving(true);
    setError("");
    try {
      const rolesRes = await fetch(`${API_URL}/api/job-roles`);
      const { jobRoles }: { jobRoles: { id: number; name: string }[] } = await rolesRes.json();
      const newJobRoleId = jobRoles.find(({ name }) => name === JOB_ROLE_NAMES[job])?.id;
      if (!newJobRoleId) throw new Error("직무를 찾을 수 없어요.");

      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/updateJob`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newJobRoleId }),
      });
      if (res.status === 401) {
        await removeToken();
        router.replace("/");
        return;
      }
      if (!res.ok) throw new Error("직무를 저장하지 못했어요.");
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "직무를 저장하지 못했어요.");
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.body, { paddingTop: insets.top + spacing.xl }]}>
        <Text style={styles.title}>{"어떤 직무를\n준비하고 있나요?"}</Text>
        <Text style={styles.sub}>직무에 맞춰 면접 질문을 만들어 드려요. 나중에 내 정보에서 바꿀 수 있어요.</Text>
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
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}>
        <Button label="시작하기" disabled={!job || saving} onPress={save} />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    body: {
      gap: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: 26,
      lineHeight: 34,
      color: colors.text,
    },
    sub: {
      fontFamily: fonts.regular,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSub,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      paddingTop: spacing.md,
    },
    error: {
      fontFamily: fonts.regular,
      fontSize: 13,
      color: colors.danger,
    },
    footer: {
      paddingTop: spacing.md,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.bg,
    },
  });

import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { NavBar } from "@/components/nav-bar";
import { TextField } from "@/components/text-field";
import { darkColors, spacing, typography } from "@/constants/theme";

const JOBS = ["프론트엔드", "백엔드", "모바일 앱", "데이터 분석", "UI/UX", "서비스 기획"];

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const [job, setJob] = useState("백엔드");

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
          <TextField label="아이디" placeholder="영문, 숫자 4~20자" autoCapitalize="none" />
          <TextField
            label="비밀번호"
            placeholder="비밀번호 입력"
            helper="8자 이상, 영문과 숫자를 섞어 주세요"
            secure
          />
          <TextField label="닉네임" placeholder="2~10자로 입력" />
          <View style={styles.jobRole}>
            <Text style={styles.jobLabel}>희망 직무 (선택)</Text>
            <View style={styles.chips}>
              {JOBS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={item === job}
                  onPress={() => setJob(item)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button label="가입하기" onPress={() => router.replace("/home")} style={styles.submit} />
        <Text style={styles.terms}>가입하면 이용약관과 개인정보 처리방침에 동의하게 돼요.</Text>
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
  body: {
    gap: spacing["2xl"],
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h3,
    color: darkColors.textPrimary,
  },
  form: {
    gap: spacing.xl,
  },
  jobRole: {
    gap: spacing.sm,
  },
  jobLabel: {
    ...typography.labelMedium,
    color: darkColors.textSecondary,
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
    color: darkColors.textTertiary,
  },
});

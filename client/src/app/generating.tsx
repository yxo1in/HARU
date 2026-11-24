import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavBar } from "@/components/nav-bar";
import { SmallPad } from "@/components/small-pad";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { getJson } from "@/lib/api";
import { CATEGORY_LABELS, todayString, type Category } from "@/lib/records";

// API 연동 전까지 생성이 끝난 것처럼 잠깐 보여주고 답변 화면으로 넘어감
const MOCK_GENERATING_MS = 2000;

export default function Generating() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const { category } = useLocalSearchParams<{ category?: Category }>();
  const [jobName, setJobName] = useState<string | null>(null);
  const categoryLabel = category ? CATEGORY_LABELS[category] : "랜덤";
  const [, month, day] = todayString().split("-").map(Number);

  useEffect(() => {
    getJson<{ jobRoleName: string | null }>("/api/profile")
      .then((profile) => setJobName(profile?.jobRoleName ?? null))
      .catch(() => {});
    const timer = setTimeout(() => router.replace("/answer"), MOCK_GENERATING_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <NavBar icon="close" onPress={() => router.back()} />
      <View style={styles.body}>
        <SmallPad>
          <Image source={assets.v4PerforationSm} style={styles.perforation} />
          <View style={styles.meta}>
            <Text style={styles.date}>{`${month}월 ${day}일`}</Text>
            <Text style={styles.category}>{categoryLabel}</Text>
          </View>
          {/* 질문 자리를 비워 둔 회색 막대 */}
          <View style={[styles.bar, styles.barTitle, { width: 200 }]} />
          <View style={[styles.bar, styles.barTitle, { width: 150 }]} />
          <View style={styles.gap} />
          <View style={[styles.bar, styles.barLine, { width: 230 }]} />
          <View style={[styles.bar, styles.barLine, { width: 180 }]} />
        </SmallPad>
        <Text style={styles.title}>질문을 만들고 있어요</Text>
        <Text style={styles.subtitle}>
          {jobName ? `${jobName}, ${categoryLabel}` : categoryLabel}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: spacing.xl,
  },
  perforation: {
    alignSelf: "center",
    width: 256,
    height: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
    paddingBottom: 10,
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  category: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSub,
  },
  bar: {
    borderRadius: 4,
    backgroundColor: colors.skeleton,
    marginBottom: 10,
  },
  barTitle: {
    height: 18,
  },
  barLine: {
    height: 10,
  },
  gap: {
    height: 10,
  },
  title: {
    marginTop: 36,
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: -0.22,
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSub,
  },
});

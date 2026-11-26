import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavBar } from "@/components/nav-bar";
import { SmallPad } from "@/components/small-pad";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";
import { getJson, postJson } from "@/lib/api";
import { CATEGORY_LABELS, todayString, type Category } from "@/lib/records";

type NewQuestion = { id: number; category: Category; content: string };

export default function Generating() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const { category } = useLocalSearchParams<{ category?: Category }>();
  const [jobName, setJobName] = useState<string | null>(null);
  const categoryLabel = category ? CATEGORY_LABELS[category] : "랜덤";
  const [, month, day] = todayString().split("-").map(Number);

  useEffect(() => {
    // 생성 중에 닫기를 눌러 나갔으면 응답이 와도 화면을 옮기지 않음
    let cancelled = false;

    getJson<{ jobRoleName: string | null }>("/api/profile")
      .then((profile) => {
        if (!cancelled) setJobName(profile?.jobRoleName ?? null);
      })
      .catch(() => {});

    // 랜덤이면 category 없이 보내서 서버가 고르게 함
    postJson<NewQuestion>("/api/questions/postQuestion", category ? { category } : {})
      .then((question) => {
        if (cancelled || !question) return;
        router.replace({
          pathname: "/answer",
          params: {
            questionId: String(question.id),
            category: question.category,
            content: question.content,
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        router.replace({ pathname: "/generation-failed", params: category ? { category } : {} });
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

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

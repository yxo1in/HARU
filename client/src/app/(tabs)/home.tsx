import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { ChartFrame, ChartLabel, ChartPoint } from "@/components/chart-frame";
import { JobPill, StreakPill } from "@/components/header-pill";
import { QuestItem } from "@/components/quest-item";
import { ScreenHeader } from "@/components/screen-header";
import { SectionHeader } from "@/components/section-header";
import { StreakDay } from "@/components/streak-day";
import {
  radius,
  spacing,
  typography,
  type ThemeColors,
} from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { useCallback, useState } from "react";
import { getToken, removeToken } from "@/lib/token";
import { JOB_ROLE_NAMES } from "@/constants/jobs";

// API 연동 전까지 쓰는 Figma 예시 데이터

const QUESTS = [
  { iconKey: "questWrite", title: "답변 1개 쓰기", current: 0, total: 1 },
  { iconKey: "questTarget", title: "80점 넘기기", current: 0, total: 1 },
  { iconKey: "questCalendar", title: "이번 주 답변 5개", current: 3, total: 5 },
] as const;

const POINTS = [
  [20, 62],
  [72.81, 50],
  [125.61, 56],
  [178.42, 38],
  [231.22, 44],
];

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Home() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  type HomeData = {
    nickname: string;
    jobRoleId: number | null;
    jobRoleName: string | null;
    last7Days: { date: string, day: string, status: "done" | "today" | "missed"}[];
  };

  const [home, setHome] = useState<HomeData | null>(null);
  // 탭은 한 번 열리면 계속 떠 있으므로, 홈으로 돌아올 때마다 다시 불러옴
  // (프로필에서 바꾼 닉네임/직무 반영)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const token = await getToken();
          const res = await fetch(`${API_URL}/api/home`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 401) {
            await removeToken();
            router.replace("/");
            return;
          }
          if (!res.ok) throw new Error(`status ${res.status}`);
          const data = await res.json();
          if (active) setHome(data);
        } catch (e) {
          console.log("home load failed:", e);
        }
      })();
      // 응답 오기 전에 다른 탭으로 가면 결과를 버림
      return () => {
        active = false;
      };
    }, []),
  );

  if (!home) return null;
  const { nickname, jobRoleName } = home;
  const job = Object.keys(JOB_ROLE_NAMES).find(
    (key) => JOB_ROLE_NAMES[key] === jobRoleName,
  );
  const {last7Days} = home
  const DAYS = last7Days
  return (
    <View style={styles.container}>
      <ScreenHeader>
        <View style={styles.pills}>
          <JobPill job={job ?? "직무 선택"} />
          <StreakPill days={5} />
        </View>
      </ScreenHeader>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            {`${nickname}님,\n오늘도 한 번\n연습해볼까요?`}
          </Text>
          <Image source={assets.haruHome} style={styles.haru} />
        </View>

        <Button
          label="연습 시작하기"
          onPress={() => router.navigate("/question")}
        />

        <View style={styles.section}>
          <SectionHeader title="지난 7일" />
          <View style={styles.days}>
            {DAYS.map((item) => (
              <StreakDay key={item.date} {...item} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="점수 흐름"
            trailing="기록 보기"
            onPressTrailing={() => router.navigate("/record")}
          />
          <ChartFrame height={125}>
            <Image source={assets.chartHomeBaseline} style={styles.baseline} />
            <Image source={assets.chartHomeLine} style={styles.line} />
            {POINTS.map(([x, y]) => (
              <ChartPoint key={x} x={x} y={y} />
            ))}
            <ChartPoint x={282.21} y={24} latest />
            <ChartLabel x={298.6} y={20} text="86점" highlight />
            <ChartLabel x={21.82} y={42} text="62점" />
            <ChartLabel x={23.64} y={89} text="6회 전" />
            <ChartLabel x={277.2} y={89} text="최근" />
          </ChartFrame>
        </View>

        <View style={styles.section}>
          <View style={styles.goalsHeader}>
            <SectionHeader title="오늘의 목표" trailing="0/3 완료" />
          </View>
          {QUESTS.map(({ iconKey, ...quest }) => (
            <QuestItem key={quest.title} icon={assets[iconKey]} {...quest} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgSecondary,
    },
    pills: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    scroll: {
      flex: 1,
    },
    body: {
      gap: spacing["2xl"],
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing["2xl"],
    },
    greeting: {
      height: 236,
    },
    greetingText: {
      ...typography.display,
      color: colors.textPrimary,
    },
    // 화면 폭이 달라도 오른쪽 기준으로 붙임 (Figma Haru 박스)
    haru: {
      position: "absolute",
      right: -32.2,
      top: 93.2,
      width: 173,
      height: 173,
    },
    section: {
      gap: spacing.md,
    },
    days: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.bgPrimary,
    },
    baseline: {
      position: "absolute",
      left: 23.64,
      top: 80.5,
      width: 264.03,
      height: 1,
    },
    line: {
      position: "absolute",
      left: 22.14,
      top: 28.5,
      width: 267.031,
      height: 39.0007,
    },
    goalsHeader: {
      paddingBottom: spacing.xs,
    },
  });

// ===================================================================
// TODO: 홈 화면 API 연동 (번호 순서대로, 서버 TODO(1)~(7) 끝난 뒤)
// ===================================================================
// TODO(8):  HomeData 타입에 streak / last7Days / scores / quests 추가
//           → 맨 위 DAYS / QUESTS / POINTS 예시 데이터 제거
// TODO(9):  <StreakPill days={5} /> → days={home.streak}
// TODO(10): 오늘의 목표 — quests 로 QUESTS 의 current 계산 + "0/3 완료" 개수 계산
// TODO(11): 지난 7일 — DAYS → last7Days, date → 요일 글자("월"~"일") 변환 필요
// TODO(12): 점수 흐름 — scores 로 점 좌표 계산 + 선은 react-native-svg 로 직접 그리기
//           (지금 chartHomeLine 은 고정 이미지라 점수가 바뀌어도 모양 그대로)
//           라벨: 첫 점수 / 최신 점수, "N회 전" / "최근"
// TODO(13): scores 가 비어 있으면 빈 상태 (haru-empty 이미지)

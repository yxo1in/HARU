import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, radius, spacing, type ThemeColors } from "@/constants/theme";

const WEEKDAY_NAMES = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

// v4 일력 카드: 위쪽 색 띠 + 절취선 + 연월/요일 + 큰 날짜(형광펜) + 오른쪽 손글씨 + 아래 내용
// 아래에 종이 두 장이 겹쳐 보이는 가장자리까지 그림. 홈, 질문(오늘 완료)에서 같이 씀
type DailyPadProps = {
  date: string; // "2026-11-23"
  doodle?: ReactNode; // 날짜 오른쪽 손글씨 ("3일 연속", "끝!")
  children?: ReactNode;
};

export function DailyPad({ date, doodle, children }: DailyPadProps) {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const [year, month, day] = date.split("-").map(Number);
  const weekday = WEEKDAY_NAMES[new Date(`${date}T00:00:00Z`).getUTCDay()];

  return (
    <View style={styles.pad}>
      <View style={styles.binding} />
      <View style={styles.sheet}>
        <Image source={assets.v4Perforation} style={styles.perforation} />
        <View style={styles.monthRow}>
          <Text style={styles.month}>{`${year}년 ${month}월`}</Text>
          <Text style={styles.weekday}>{weekday}</Text>
        </View>
        <View style={styles.dateRow}>
          <View style={styles.date}>
            <View style={styles.highlighter} />
            <Text style={styles.dateText}>{day}</Text>
          </View>
          {doodle}
        </View>
        {children}
      </View>
      <View style={[styles.pageEdge, styles.pageEdgeFirst]} />
      <View style={[styles.pageEdge, styles.pageEdgeSecond]} />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: {
      alignItems: "center",
    },
    binding: {
      alignSelf: "stretch",
      height: 14,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      backgroundColor: colors.accent,
    },
    sheet: {
      alignSelf: "stretch",
      paddingTop: spacing.lg,
      paddingHorizontal: 22,
      paddingBottom: 22,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.lineSoft,
      borderBottomLeftRadius: radius.sm,
      borderBottomRightRadius: radius.sm,
      backgroundColor: colors.surface,
    },
    perforation: {
      alignSelf: "center",
      width: 301,
      height: 8,
    },
    monthRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 14,
    },
    month: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.text,
    },
    weekday: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.textSub,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
    },
    date: {
      height: 128,
      justifyContent: "center",
    },
    // 날짜 아래쪽에 살짝 기울어진 형광펜 (다크에서는 투명)
    highlighter: {
      position: "absolute",
      left: -4,
      right: -4,
      top: 64,
      height: 46,
      borderRadius: radius.sm,
      backgroundColor: colors.highlighter,
      transform: [{ rotate: "-2deg" }],
    },
    dateText: {
      fontFamily: fonts.bold,
      fontSize: 128,
      lineHeight: 128,
      letterSpacing: -2.56,
      color: colors.text,
    },
    pageEdge: {
      height: 4,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.line,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: colors.surface,
    },
    pageEdgeFirst: {
      alignSelf: "stretch",
      marginHorizontal: 6,
    },
    pageEdgeSecond: {
      alignSelf: "stretch",
      marginHorizontal: 12,
    },
  });

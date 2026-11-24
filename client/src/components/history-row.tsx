import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, radius, type ThemeColors } from "@/constants/theme";
import { CATEGORY_LABELS, type RecordListItem } from "@/lib/records";

// v4 기록 한 줄: 왼쪽 작은 일력(월/일) + 유형·재답변 뱃지·질문 + 오른쪽 손글씨 점수
type HistoryRowProps = {
  item: Pick<RecordListItem, "answerDate" | "category" | "question" | "score" | "retryCount">;
  onPress?: () => void;
};

export function HistoryRow({ item, onPress }: HistoryRowProps) {
  const styles = useThemedStyles(createStyles);
  const [, month, day] = item.answerDate.split("-").map(Number);

  return (
    <Pressable style={styles.row} disabled={!onPress} onPress={onPress}>
      <View style={styles.page}>
        <View style={styles.band}>
          <Text style={styles.month}>{`${month}월`}</Text>
        </View>
        <View style={styles.dayWrap}>
          <Text style={styles.day}>{day}</Text>
        </View>
      </View>
      <View style={styles.text}>
        <View style={styles.meta}>
          <Text style={styles.category}>{CATEGORY_LABELS[item.category]}</Text>
          {item.retryCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{`재답변 ${item.retryCount}번`}</Text>
            </View>
          )}
        </View>
        <Text style={styles.question} numberOfLines={2}>
          {item.question}
        </Text>
      </View>
      {/* 채점이 끝나지 않았으면 점수 대신 "-" */}
      <Text style={item.score === null ? styles.scoreEmpty : styles.score}>
        {item.score ?? "-"}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  page: {
    width: 46,
    height: 52,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  band: {
    height: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  month: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    color: colors.onAccent,
  },
  dayWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  day: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.2,
    color: colors.text,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  category: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSub,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: colors.highlight,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.onHighlight,
  },
  question: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  score: {
    fontFamily: fonts.pen,
    fontSize: 40,
    lineHeight: 36,
    color: colors.accent,
  },
  scoreEmpty: {
    fontFamily: fonts.pen,
    fontSize: 40,
    lineHeight: 36,
    color: colors.textFaint,
  },
});

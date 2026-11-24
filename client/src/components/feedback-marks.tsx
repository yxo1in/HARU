import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";

// v4 첨삭: 좋았던 점(동그라미) / 아쉬운 점(세모) / 손글씨 "이렇게 바꿔보면" + 형광펜 친 제안
type FeedbackMarksProps = {
  strength: string;
  weakness: string;
  suggestion: string;
};

export function FeedbackMarks({ strength, weakness, suggestion }: FeedbackMarksProps) {
  const styles = useThemedStyles(createStyles);
  const { assets, scheme } = useTheme();

  return (
    <View style={styles.list}>
      <View style={styles.item}>
        <Image source={assets.v4MarkGood} style={styles.mark} />
        <View style={styles.text}>
          <Text style={styles.label}>좋았던 점</Text>
          <Text style={styles.body}>{strength}</Text>
        </View>
      </View>
      <View style={styles.item}>
        <Image source={assets.v4MarkBad} style={styles.mark} />
        <View style={styles.text}>
          <Text style={styles.label}>아쉬운 점</Text>
          <Text style={styles.body}>{weakness}</Text>
        </View>
      </View>
      <View style={styles.suggestion}>
        <Text style={styles.suggestionLabel}>이렇게 바꿔보면</Text>
        {/* 라이트는 글자 아래쪽에 얇은 형광펜, 다크는 글자 전체에 노란 상자 */}
        <View style={styles.highlightWrap}>
          <View>
            {scheme !== "dark" && <View style={styles.highlighter} />}
            <Text
              style={[styles.suggestionText, scheme === "dark" ? styles.suggestionBox : styles.suggestionPlain]}
            >
              {suggestion}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  list: {
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  mark: {
    width: 26,
    height: 26,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  suggestion: {
    gap: spacing.xs,
  },
  suggestionLabel: {
    fontFamily: fonts.pen,
    fontSize: 26,
    lineHeight: 24,
    color: colors.accent,
  },
  highlightWrap: {
    alignItems: "flex-start",
  },
  suggestionText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  // 글자 아래쪽 절반에 살짝 기울어진 형광펜 (글자 뒤에 깔림)
  highlighter: {
    position: "absolute",
    left: -4,
    right: -4,
    top: 9,
    bottom: 3,
    borderRadius: 3,
    backgroundColor: colors.highlighter,
    transform: [{ rotate: "-0.6deg" }],
  },
  suggestionPlain: {
    color: colors.text,
  },
  suggestionBox: {
    color: colors.onHighlight,
    paddingHorizontal: 6,
    marginLeft: -6,
    borderRadius: 4,
    backgroundColor: colors.highlight,
    overflow: "hidden",
  },
});

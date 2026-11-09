import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

const CORNER_TAIL = 6;
const ME_MAX_WIDTH = 270;

export function HaruBubble({ text }: { text: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.bubble, styles.haru]}>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

export function QuestionBubble({ category, text }: { category: string; text: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.bubble, styles.haru]}>
      <Text style={styles.category}>{category}</Text>
      <Text style={styles.question}>{text}</Text>
    </View>
  );
}

export function MyBubble({ text, time }: { text: string; time: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.myRow}>
      <View style={[styles.bubble, styles.me]}>
        <Text style={styles.bodyOnAccent}>{text}</Text>
      </View>
      <Text style={styles.caption}>{time}</Text>
    </View>
  );
}

type HaruMessagesProps = {
  time?: string;
  children: ReactNode;
};

export function HaruMessages({ time, children }: HaruMessagesProps) {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  return (
    <View style={styles.haruRow}>
      <View style={styles.avatar}>
        <Image
          source={assets.haruAvatar}
          style={styles.avatarImage}
        />
      </View>
      <View style={styles.column}>
        <Text style={styles.name}>하루 면접관</Text>
        {children}
        {time ? <Text style={styles.caption}>{time}</Text> : null}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  haruRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
  },
  avatarImage: {
    position: "absolute",
    left: -13.2,
    top: -10.2,
    width: 63,
    height: 63,
  },
  column: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  name: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  myRow: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  bubble: {
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  haru: {
    borderTopLeftRadius: CORNER_TAIL,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
    boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
  },
  me: {
    maxWidth: ME_MAX_WIDTH,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: CORNER_TAIL,
    backgroundColor: colors.accentStrong,
  },
  body: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  bodyOnAccent: {
    ...typography.bodyMedium,
    color: colors.textOnAccent,
  },
  category: {
    ...typography.labelSmall,
    color: colors.textBrand,
  },
  question: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  caption: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});

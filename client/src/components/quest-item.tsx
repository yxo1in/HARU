import { Image, type ImageSource } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

type QuestItemProps = {
  icon: ImageSource;
  title: string;
  current: number;
  total: number;
};

export function QuestItem({ icon, title, current, total }: QuestItemProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.count}>
            {current}/{total}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.progress, { width: `${(current / total) * 100}%` }]} />
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 64,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.bgBrandSubtle,
  },
  icon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: spacing.sm,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  count: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  track: {
    height: 8,
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: colors.bgTertiary,
  },
  progress: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.accentStrong,
  },
});

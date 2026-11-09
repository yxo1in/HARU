import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

type SectionHeaderProps = {
  title: string;
  trailing?: string;
  onPressTrailing?: () => void;
};

export function SectionHeader({ title, trailing, onPressTrailing }: SectionHeaderProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {trailing ? (
        <Pressable disabled={!onPressTrailing} onPress={onPressTrailing}>
          <Text style={styles.trailing}>{trailing}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  trailing: {
    ...typography.labelMedium,
    color: colors.textTertiary,
  },
});

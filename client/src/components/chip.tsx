import { Pressable, StyleSheet, Text } from "react-native";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      style={[styles.chip, selected && styles.selected]}
      accessibilityRole="button"
      aria-selected={selected}
      onPress={onPress}
    >
      <Text style={selected ? styles.labelSelected : styles.label}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  chip: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.full,
    backgroundColor: colors.bgPrimary,
  },
  selected: {
    borderWidth: 1.5,
    borderColor: colors.borderFocus,
    backgroundColor: colors.bgBrandSubtle,
  },
  label: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  labelSelected: {
    ...typography.labelMedium,
    color: colors.textBrand,
  },
});

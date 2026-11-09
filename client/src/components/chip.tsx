import { Pressable, StyleSheet, Text } from "react-native";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
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

const styles = StyleSheet.create({
  chip: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: darkColors.borderDefault,
    borderRadius: radius.full,
    backgroundColor: darkColors.bgPrimary,
  },
  selected: {
    borderWidth: 1.5,
    borderColor: darkColors.borderFocus,
    backgroundColor: darkColors.bgBrandSubtle,
  },
  label: {
    ...typography.labelMedium,
    color: darkColors.textSecondary,
  },
  labelSelected: {
    ...typography.labelMedium,
    color: darkColors.textBrand,
  },
});

import { Pressable, StyleSheet, Text } from "react-native";
import { fonts, type ThemeColors } from "@/constants/theme";
import { useThemedStyles } from "@/components/theme-provider";

// v4 태그: 선택되면 버튼 색(검정)으로 채움, 아니면 얇은 테두리
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
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.buttonBg,
    backgroundColor: colors.buttonBg,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  labelSelected: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.buttonText,
  },
});

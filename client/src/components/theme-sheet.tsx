import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheet } from "@/components/bottom-sheet";
import {
  useTheme,
  useThemedStyles,
  type ThemePreference,
} from "@/components/theme-provider";
import { spacing, typography, type ThemeColors } from "@/constants/theme";

const THEME_OPTIONS: { label: ThemePreference; description: string }[] = [
  { label: "시스템 설정", description: "휴대폰 설정을 따라가요" },
  { label: "시간대별", description: "낮에는 해, 밤에는 보름달 (18시~6시)" },
  { label: "라이트", description: "항상 해" },
  { label: "다크", description: "항상 보름달" },
];

export function ThemeSheet({ onClose }: { onClose: () => void }) {
  const styles = useThemedStyles(createStyles);
  const { assets, preference, setPreference } = useTheme();

  return (
    <BottomSheet title="화면 테마" subtitle="Haru도 같이 바뀌어요" onClose={onClose}>
      {THEME_OPTIONS.map(({ label, description }, index) => {
        const isSelected = label === preference;
        return (
          <Pressable
            key={label}
            style={[styles.option, index < THEME_OPTIONS.length - 1 && styles.optionDivider]}
            accessibilityRole="radio"
            aria-checked={isSelected}
            onPress={() => {
              setPreference(label);
              onClose();
            }}
          >
            <View style={styles.optionText}>
              <Text style={isSelected ? styles.labelSelected : styles.label}>{label}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            {isSelected ? (
              <Image source={assets.radioOn} style={styles.radioOn} />
            ) : (
              <View style={styles.radioOff} />
            )}
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 68,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  labelSelected: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  radioOn: {
    width: 24,
    height: 24,
  },
  radioOff: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: 12,
  },
});

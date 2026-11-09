import { Image } from "expo-image";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { darkColors, spacing, typography } from "@/constants/theme";

export const THEME_OPTIONS = [
  { label: "시스템 설정", description: "휴대폰 설정을 따라가요" },
  { label: "시간대별", description: "낮에는 해, 밤에는 보름달 (18시~6시)" },
  { label: "라이트", description: "항상 해" },
  { label: "다크", description: "항상 보름달" },
];

type ThemeSheetProps = {
  visible: boolean;
  selected: string;
  onSelect: (label: string) => void;
  onClose: () => void;
};

export function ThemeSheet({ visible, selected, onSelect, onClose }: ThemeSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.scrim} accessibilityLabel="닫기" onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.title}>화면 테마</Text>
            <Text style={styles.subtitle}>Haru도 같이 바뀌어요</Text>
          </View>
          <View style={styles.options}>
            {THEME_OPTIONS.map(({ label, description }, index) => {
              const isSelected = label === selected;
              return (
                <Pressable
                  key={label}
                  style={[styles.option, index < THEME_OPTIONS.length - 1 && styles.optionDivider]}
                  accessibilityRole="radio"
                  aria-checked={isSelected}
                  onPress={() => onSelect(label)}
                >
                  <View style={styles.optionText}>
                    <Text style={isSelected ? styles.labelSelected : styles.label}>{label}</Text>
                    <Text style={styles.description}>{description}</Text>
                  </View>
                  {isSelected ? (
                    <Image
                      source={require("@/assets/images/icons/radio-on.svg")}
                      style={styles.radioOn}
                    />
                  ) : (
                    <View style={styles.radioOff} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: darkColors.scrim,
  },
  sheet: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: darkColors.bgPrimary,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: darkColors.borderStrong,
  },
  head: {
    alignSelf: "stretch",
    gap: spacing.xs,
    paddingTop: 20,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: darkColors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: darkColors.textTertiary,
  },
  options: {
    alignSelf: "stretch",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 68,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: darkColors.borderDefault,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    ...typography.bodyLarge,
    color: darkColors.textPrimary,
  },
  labelSelected: {
    ...typography.labelLarge,
    color: darkColors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: darkColors.textTertiary,
  },
  radioOn: {
    width: 24,
    height: 24,
  },
  radioOff: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: darkColors.borderStrong,
    borderRadius: 12,
  },
});

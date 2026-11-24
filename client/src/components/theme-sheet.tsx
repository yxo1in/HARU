import { StyleSheet, View } from "react-native";
import { BottomSheet } from "@/components/bottom-sheet";
import { RadioRow } from "@/components/radio-row";
import {
  useTheme,
  useThemedStyles,
  type ThemePreference,
} from "@/components/theme-provider";
import type { ThemeColors } from "@/constants/theme";

const THEME_OPTIONS: { label: ThemePreference; description: string }[] = [
  { label: "시스템 설정", description: "휴대폰 설정을 따라가요" },
  { label: "시간대별", description: "오후 6시부터 오전 6시까지 어둡게" },
  { label: "라이트", description: "항상 밝게" },
  { label: "다크", description: "항상 어둡게" },
];

export function ThemeSheet({ onClose }: { onClose: () => void }) {
  const styles = useThemedStyles(createStyles);
  const { preference, setPreference } = useTheme();

  return (
    <BottomSheet title="화면 테마" subtitle="이 휴대폰에만 저장돼요." onClose={onClose}>
      {THEME_OPTIONS.map(({ label, description }, index) => (
        <View key={label}>
          {index > 0 && <View style={styles.divider} />}
          <RadioRow
            title={label}
            desc={description}
            selected={label === preference}
            onPress={() => {
              setPreference(label);
              onClose();
            }}
          />
        </View>
      ))}
    </BottomSheet>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
});

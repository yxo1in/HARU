import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, type ThemeColors } from "@/constants/theme";

// v4 라디오 한 줄: 왼쪽 동그라미 + 제목/설명. 질문 유형 고르기, 화면 테마에서 같이 씀
type RadioRowProps = {
  title: string;
  desc: string;
  selected: boolean;
  onPress: () => void;
};

export function RadioRow({ title, desc, selected, onPress }: RadioRowProps) {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();

  return (
    <Pressable
      style={styles.row}
      accessibilityRole="radio"
      aria-checked={selected}
      onPress={onPress}
    >
      <Image source={selected ? assets.v4RadioOn : assets.v4RadioOff} style={styles.radio} />
      <View style={styles.text}>
        <Text style={selected ? styles.titleOn : styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  radio: {
    width: 22,
    height: 22,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  titleOn: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  desc: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
});

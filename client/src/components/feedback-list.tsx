import { StyleSheet, Text, View } from "react-native";
import { darkColors, typography } from "@/constants/theme";

// API 연동 전까지 쓰는 Figma 예시 데이터
const SAMPLE_FEEDBACK = [
  { title: "좋았던 점", color: darkColors.textSuccess, text: "회사 서비스를 구체적으로 언급했어요." },
  { title: "아쉬운 점", color: darkColors.textWarning, text: "내 경험과 잘 이어지지 않아요." },
  {
    title: "이렇게 바꿔보면",
    color: darkColors.textBrand,
    text: "직접 만든 프로젝트를\n예로 들어 보세요.",
  },
];

export function FeedbackList() {
  return (
    <>
      {SAMPLE_FEEDBACK.map(({ title, color, text }) => (
        <View key={title} style={styles.item}>
          <Text style={[styles.title, { color }]}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 2,
  },
  title: {
    ...typography.labelSmall,
  },
  text: {
    ...typography.bodyMedium,
    color: darkColors.textPrimary,
  },
});

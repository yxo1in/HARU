import { StyleSheet, Text, View } from "react-native";
import { darkColors, typography } from "@/constants/theme";

type SectionHeaderProps = {
  title: string;
  trailing?: string;
};

export function SectionHeader({ title, trailing }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.h4,
    color: darkColors.textPrimary,
  },
  trailing: {
    ...typography.labelMedium,
    color: darkColors.textTertiary,
  },
});

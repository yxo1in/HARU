import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useThemedStyles } from "@/components/theme-provider";
import { radius, spacing, type ThemeColors } from "@/constants/theme";

// v4 가운데 놓는 300px 일력 한 장 (질문 생성 중 / 실패, 채점 중 / 실패)
// edges: 아래에 종이 두 장이 겹친 가장자리를 그릴지
type SmallPadProps = {
  children: ReactNode;
  edges?: boolean;
  height?: number;
  padded?: boolean;
};

export function SmallPad({ children, edges = true, height, padded = true }: SmallPadProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.pad}>
      <View style={styles.binding} />
      <View style={[styles.sheet, padded && styles.sheetPadded, height ? { height } : null]}>
        {children}
      </View>
      {edges && (
        <>
          <View style={[styles.edge, styles.edgeFirst]} />
          <View style={[styles.edge, styles.edgeSecond]} />
        </>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  pad: {
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },
  binding: {
    alignSelf: "stretch",
    height: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: colors.accent,
  },
  sheet: {
    alignSelf: "stretch",
    overflow: "hidden",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.lineSoft,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  sheetPadded: {
    paddingTop: spacing.lg,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  edge: {
    height: 4,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: colors.surface,
  },
  edgeFirst: {
    alignSelf: "stretch",
    marginHorizontal: 6,
  },
  edgeSecond: {
    alignSelf: "stretch",
    marginHorizontal: 12,
  },
});

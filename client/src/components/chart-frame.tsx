import { Image } from "expo-image";
import { useState, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { radius, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

// Figma 차트 카드 폭. 내부 좌표가 이 폭 기준이라 화면 폭에 맞춰 통째로 확대·축소함
const DESIGN_WIDTH = 345;

type ChartFrameProps = {
  height: number;
  children: ReactNode;
};

export function ChartFrame({ height, children }: ChartFrameProps) {
  const styles = useThemedStyles(createStyles);
  const [scale, setScale] = useState(1);

  return (
    <View
      style={[styles.card, { height: height * scale }]}
      onLayout={(event) => setScale(event.nativeEvent.layout.width / DESIGN_WIDTH)}
    >
      <View style={[styles.canvas, { height, transform: [{ scale }] }]}>
        {children}
      </View>
    </View>
  );
}

type ChartPointProps = {
  x: number;
  y: number;
  latest?: boolean;
};

export function ChartPoint({ x, y, latest }: ChartPointProps) {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const size = latest ? 12 : 8;

  return (
    <Image
      source={
        latest
          ? assets.chartPointLatest
          : assets.chartPoint
      }
      style={[styles.absolute, { left: x, top: y, width: size, height: size }]}
    />
  );
}

type ChartLabelProps = {
  x: number;
  y: number;
  text: string;
  highlight?: boolean;
};

export function ChartLabel({ x, y, text, highlight }: ChartLabelProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Text
      style={[
        styles.absolute,
        highlight ? styles.labelHighlight : styles.label,
        { left: x, top: y },
      ]}
    >
      {text}
    </Text>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    alignSelf: "stretch",
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
  },
  canvas: {
    width: DESIGN_WIDTH,
    transformOrigin: "left top",
  },
  absolute: {
    position: "absolute",
  },
  label: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  labelHighlight: {
    ...typography.labelMedium,
    color: colors.textBrand,
  },
});

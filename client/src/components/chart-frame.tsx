import { Image } from "expo-image";
import { useState, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors, radius, typography } from "@/constants/theme";

// Figma 차트 카드 폭. 내부 좌표가 이 폭 기준이라 화면 폭에 맞춰 통째로 확대·축소함
const DESIGN_WIDTH = 345;

type ChartFrameProps = {
  height: number;
  children: ReactNode;
};

export function ChartFrame({ height, children }: ChartFrameProps) {
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
  const size = latest ? 12 : 8;

  return (
    <Image
      source={
        latest
          ? require("@/assets/images/chart/point-latest.svg")
          : require("@/assets/images/chart/point.svg")
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

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: darkColors.bgPrimary,
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
    color: darkColors.textTertiary,
  },
  labelHighlight: {
    ...typography.labelMedium,
    color: darkColors.textBrand,
  },
});

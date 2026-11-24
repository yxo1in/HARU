import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { fonts, type ThemeColors } from "@/constants/theme";

// v4 점수 동그라미: 연한 바탕 + 점수만큼 12시부터 시계 방향으로 채워지는 원호 + 손글씨 점수
type ScoreCircleProps = {
  score: number;
  size?: number;
};

const STROKE = 3;

export function ScoreCircle({ score, size = 58 }: ScoreCircleProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const r = (size - STROKE) / 2;
  const length = 2 * Math.PI * r;
  const ratio = Math.min(Math.max(score, 0), 100) / 100;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={colors.accentSoft} />
        {/* -90도 돌려서 12시 방향에서 시작 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors.accent}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${length * ratio} ${length}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, { fontSize: size * 0.62, lineHeight: size * 0.56 }]}>
          {score}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontFamily: fonts.pen,
    color: colors.accent,
  },
  empty: {
    fontFamily: fonts.pen,
    color: colors.textFaint,
  },
});

// 채점 중: 연한 바탕 + 12시부터 짧은 원호가 계속 돌아감 + 손글씨 "..."
export function GradingCircle({ size = 76 }: { size?: number }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  // 렌더할 때마다 새로 만들지 않도록 처음 한 번만 만든 값을 계속 씀
  const [spin] = useState(() => new Animated.Value(0));
  const r = (size - 4) / 2;
  const length = 2 * Math.PI * r;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={colors.accentSoft} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={colors.accent}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${length * 0.2} ${length}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      </Animated.View>
      <View style={styles.center}>
        <Text style={[styles.score, { fontSize: size * 0.53, lineHeight: size * 0.48 }]}>...</Text>
      </View>
    </View>
  );
}

// 점수 없음(채점 실패): 점선 동그라미 + 흐린 손글씨 "?"
export function EmptyScoreCircle({ size = 76 }: { size?: number }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const r = (size - 3) / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors.line}
          strokeWidth={3}
          strokeDasharray="6 6"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.empty, { fontSize: size * 0.58, lineHeight: size * 0.52 }]}>?</Text>
      </View>
    </View>
  );
}

import { StyleSheet, Text, View } from "react-native";
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
});

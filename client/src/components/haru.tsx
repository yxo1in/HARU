import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { colors } from "@/constants/theme";

// Figma Haru 컴포넌트 (324 × 324)
const SIZE = 324;
const CENTER_X = 162;
const CENTER_Y = 148.5;
const RAY_DISTANCE = 118.8;
const RAY_WIDTH = 13.5;
const RAY_LENGTH = 27;
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function Haru() {
  return (
    <View style={styles.container}>
      {RAY_ANGLES.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <View
            key={angle}
            style={[
              styles.ray,
              {
                left: CENTER_X + RAY_DISTANCE * Math.sin(rad) - RAY_WIDTH / 2,
                top: CENTER_Y - RAY_DISTANCE * Math.cos(rad) - RAY_LENGTH / 2,
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          />
        );
      })}
      <Image source={require("@/assets/images/haru-orb.svg")} style={styles.orb} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
  },
  ray: {
    position: "absolute",
    width: RAY_WIDTH,
    height: RAY_LENGTH,
    borderRadius: RAY_WIDTH / 2,
    backgroundColor: colors.mascot.ray,
  },
  orb: {
    position: "absolute",
    left: 67.5,
    top: 54,
    width: 189,
    height: 189,
  },
});

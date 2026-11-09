import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { StatusScreen } from "@/components/status-screen";

// API 연동 전까지 생성이 끝난 것처럼 잠깐 보여주고 답변 화면으로 넘어감
const MOCK_GENERATING_MS = 2000;

export default function Generating() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace("/answer"), MOCK_GENERATING_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StatusScreen
      mascot={require("@/assets/images/mascot/haru-thinking.png")}
      mascotOverlay={
        <Image
          source={require("@/assets/images/mascot/thinking-dots.png")}
          style={styles.dots}
        />
      }
      title="질문을 만들고 있어요"
      subtitle="백엔드 직무 지원동기 질문"
    />
  );
}

const styles = StyleSheet.create({
  dots: {
    position: "absolute",
    left: 140.5,
    top: 26,
    width: 74,
    height: 42,
  },
});

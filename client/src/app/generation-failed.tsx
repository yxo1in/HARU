import { router } from "expo-router";
import { Button } from "@/components/button";
import { StatusScreen } from "@/components/status-screen";

export default function GenerationFailed() {
  return (
    <StatusScreen
      mascot={require("@/assets/images/mascot/haru-failed.png")}
      title="질문을 못 만들었어요"
      subtitle="연결이 잠깐 불안정했어요. 다시 해볼까요?"
    >
      <Button label="다시 시도" onPress={() => router.replace("/generating")} />
      <Button
        label="다른 질문 받기"
        variant="ghost"
        size="sm"
        onPress={() => router.replace("/generating")}
      />
    </StatusScreen>
  );
}

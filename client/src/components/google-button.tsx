import { StyleSheet } from "react-native";
import { Button } from "@/components/button";

// 앱(iOS/Android)용. 구글 로그인은 지금 웹에서만 돼서, 누르면 준비 중 안내만 띄움
// (앱에서 하려면 네이티브 라이브러리 + 개발 빌드가 필요함)
type GoogleButtonProps = {
  onCredential: (idToken: string) => void;
  onUnavailable: () => void;
};

export function GoogleButton({ onUnavailable }: GoogleButtonProps) {
  return <Button label="Google로 계속하기" style={styles.button} onPress={onUnavailable} />;
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
  },
});

import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/button";
import { useTheme } from "@/components/theme-provider";

// 웹 전용 구글 로그인 버튼 (Google Identity Services).
// 구글 스크립트가 그려 주는 버튼을 쓰고, 로그인하면 ID 토큰(credential)을 onCredential 로 넘김
type GoogleButtonProps = {
  onCredential: (idToken: string) => void;
  onUnavailable: () => void;
};

type GoogleId = {
  initialize: (options: { client_id: string; callback: (res: { credential: string }) => void }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const SCRIPT_URL = "https://accounts.google.com/gsi/client";

// 스크립트는 페이지당 한 번만 불러옴
let scriptPromise: Promise<void> | null = null;
function loadScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("구글 스크립트를 불러오지 못함"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// initialize 는 한 번만 부르고, 로그인 결과는 지금 화면에 있는 버튼의 콜백으로 보냄
let initialized = false;
let handleCredential: ((idToken: string) => void) | null = null;

export function GoogleButton({ onCredential, onUnavailable }: GoogleButtonProps) {
  const { scheme } = useTheme();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleCredential = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let active = true;
    loadScript()
      .then(() => {
        const google = window.google?.accounts.id;
        const parent = box.current;
        if (!active || !google || !parent) return;
        if (!initialized) {
          google.initialize({
            client_id: CLIENT_ID,
            callback: (res) => handleCredential?.(res.credential),
          });
          initialized = true;
        }
        // 테마가 바뀌면 버튼을 다시 그림. 구글 버튼 폭은 최대 400px
        parent.innerHTML = "";
        google.renderButton(parent, {
          type: "standard",
          theme: scheme === "dark" ? "outline" : "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          locale: "ko",
          width: Math.min(parent.offsetWidth || 320, 400),
        });
      })
      .catch(() => {
        if (active) onUnavailable();
      });
    return () => {
      active = false;
    };
  }, [scheme, onUnavailable]);

  // 클라이언트 ID 가 없으면 원래 버튼을 두고 안내만 띄움
  if (!CLIENT_ID) {
    return <Button label="Google로 계속하기" style={styles.fallback} onPress={onUnavailable} />;
  }

  return (
    <View style={styles.wrap}>
      <div ref={box} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "stretch",
    minHeight: 54,
    justifyContent: "center",
  },
  fallback: {
    alignSelf: "stretch",
  },
});

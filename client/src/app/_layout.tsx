import {
  IBMPlexSansKR_400Regular,
  IBMPlexSansKR_500Medium,
  IBMPlexSansKR_600SemiBold,
  IBMPlexSansKR_700Bold,
  useFonts,
} from "@expo-google-fonts/ibm-plex-sans-kr";
import { NanumPenScript_400Regular } from "@expo-google-fonts/nanum-pen-script";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

// 폰트를 다 불러올 때까지 스플래시를 띄워 둠 (기본 글꼴로 잠깐 보였다가 바뀌는 것 방지)
SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}

export default function RootLayout() {
  // 키 이름이 곧 fontFamily 이름 (constants/theme.ts 의 fonts 와 같아야 함)
  const [loaded, error] = useFonts({
    IBMPlexSansKR_400Regular,
    IBMPlexSansKR_500Medium,
    IBMPlexSansKR_600SemiBold,
    IBMPlexSansKR_700Bold,
    NanumPenScript_400Regular,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // 폰트 로딩에 실패해도 기본 글꼴로라도 앱은 띄움
  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}

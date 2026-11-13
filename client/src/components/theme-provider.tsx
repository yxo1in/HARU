import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { themeAssets, type ThemeAssets } from "@/constants/assets";
import { darkColors, lightColors, type ThemeColors } from "@/constants/theme";

export type ThemePreference = "시스템 설정" | "시간대별" | "라이트" | "다크";
type Scheme = "light" | "dark";

type ThemeValue = {
  scheme: Scheme;
  colors: ThemeColors;
  assets: ThemeAssets;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const NIGHT_START_HOUR = 18;
const NIGHT_END_HOUR = 6;
const CLOCK_CHECK_MS = 60_000;

function isNightNow() {
  const hour = new Date().getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

// 시간대별 테마일 때만 1분마다 다시 그려서 18시, 6시에 맞춰 바뀌게 함
function useIsNight(enabled: boolean) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => setTick((tick) => tick + 1), CLOCK_CHECK_MS);
    return () => clearInterval(timer);
  }, [enabled]);

  return isNightNow();
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>("시간대별");
  const systemScheme = useColorScheme();
  const night = useIsNight(preference === "시간대별");

  const scheme: Scheme =
    preference === "다크" ||
    (preference === "시간대별" && night) ||
    (preference === "시스템 설정" && systemScheme === "dark")
      ? "dark"
      : "light";

  const value = useMemo(
    () => ({
      scheme,
      colors: scheme === "dark" ? darkColors : lightColors,
      assets: themeAssets[scheme],
      preference,
      setPreference,
    }),
    [scheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return value;
}

export function useThemedStyles<T>(createStyles: (colors: ThemeColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [createStyles, colors]);
}

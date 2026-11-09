import { Platform } from "react-native";

// 웹 브라우저가 입력칸 안쪽에 그리는 기본 포커스 테두리를 없앰. outlineStyle의 "none"은 RN 타입에 없음
export const noWebOutline = Platform.select<object>({
  web: { outlineStyle: "none" },
  default: {},
});

export const palette = {
  white: "#ffffff",
  neutral900: "#141414",
  violet200: "#ffe68a",
} as const;

export const colors = {
  textPrimary: "#141414",
  textInverse: "#ffffff",
  bgInverse: "#141414",
  bgSky: "#e3f0ff",
  accent: "#ffc000",
  mascot: {
    top: "#fff4b8",
    mid: "#ffdb4d",
    bottom: "#ffbe1a",
    shade: "#d98a0038",
    glow: "#ffcf5a00",
    ray: "#ffc83d",
    cheek: "#ff8a5b",
  },
} as const;

export const darkColors = {
  bgPrimary: "#1b1d38",
  bgSecondary: "#0f1022",
  bgHeader: "#1b1d38",
  textPrimary: "#f2f1fa",
  textTertiary: "#8e8da8",
  textBrand: "#ffd15c",
  borderDefault: "#30335a",
  borderStrong: "#41456e",
  borderFocus: "#ffe07f",
  bgTertiary: "#24274a",
  bgBrandSubtle: "#2b2a47",
  textSecondary: "#bdbcd3",
  textAccent: "#ffe07f",
  textDanger: "#ffafa6",
  textOnAccent: "#0f1022",
  accentStrong: "#ffd15c",
  mascotFace: "#141414",
  mascotTop: "#fffbea",
  mascotMid: "#fff0bf",
  mascotBottom: "#f3d98a",
  bgSky: "#24274a",
  bgInverse: "#fff6d9",
  textInverse: "#0f1022",
  textSuccess: "#6debb8",
  bgSuccessSubtle: "#12302a",
  textWarning: "#ffe280",
  focusRing: "rgba(255,224,127,0.18)",
  scrim: "rgba(15,16,34,0.5)",
  actionDefault: "#ffd15c",
} as const;

export type ThemeColors = { [K in keyof typeof darkColors]: string };

export const lightColors: ThemeColors = {
  bgPrimary: "#ffffff",
  bgSecondary: "#f4f9ff",
  bgHeader: "#ffffff",
  textPrimary: "#141414",
  textTertiary: "#6e6963",
  textBrand: "#946200",
  borderDefault: "#dce4ee",
  borderStrong: "#c5d0dd",
  borderFocus: "#b88200",
  bgTertiary: "#eaf0f7",
  bgBrandSubtle: "#fffbea",
  textSecondary: "#55514c",
  textAccent: "#946200",
  textDanger: "#d43a2c",
  textOnAccent: "#141414",
  accentStrong: "#f0ac00",
  mascotFace: "#141414",
  mascotTop: "#fff4b8",
  mascotMid: "#ffdb4d",
  mascotBottom: "#ffbe1a",
  bgSky: "#e3f0ff",
  bgInverse: "#141414",
  textInverse: "#ffffff",
  textSuccess: "#118059",
  bgSuccessSubtle: "#eafff6",
  textWarning: "#8a5a00",
  focusRing: "#ffe68a99",
  scrim: "rgba(15,16,34,0.5)",
  actionDefault: "#ffc000",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
} as const;

export const radius = {
  none: 0,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

export const fontFamily = {
  base: "Pretendard",
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.base,
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 50,
    letterSpacing: -1.2, // Figma -3% × 40
  },
  h2: {
    fontFamily: fontFamily.base,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 38,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: fontFamily.base,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: fontFamily.base,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fontFamily.base,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0,
  },
  score: {
    fontFamily: fontFamily.base,
    fontSize: 56,
    fontWeight: "400",
    lineHeight: 64,
    letterSpacing: -1.68,
  },
  bodyLarge: {
    fontFamily: fontFamily.base,
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 28,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamily.base,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamily.base,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0,
  },
  labelLarge: {
    fontFamily: fontFamily.base,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0,
  },
  labelSmall: {
    fontFamily: fontFamily.base,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0,
  },
  labelMedium: {
    fontFamily: fontFamily.base,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

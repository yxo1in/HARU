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

// 테마와 상관없는 고정 색 (v3 마스코트용. 마스코트를 쓰는 화면이 남아 있는 동안만 유지)
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

// ---------------------------------------------------------------------
// v4 색 (Figma "Screens · v4")
//  - 아래쪽 "v3 이름" 은 아직 v4 로 안 바꾼 화면이 깨지지 않게 v4 색에 연결해 둔 것
// ---------------------------------------------------------------------
export const darkColors = {
  // v4
  bg: "#000000", // 화면 바탕
  surface: "#1c1c1e", // 카드, 날짜 칸, 탭 바
  surfaceMuted: "rgba(28,28,30,0.5)", // 답변 안 한 날 같은 흐린 칸
  text: "#f5f5f2",
  textSub: "#a0a3a8",
  textFaint: "#6b6e73",
  line: "#3a3a3c", // 구분선, 탭 바 위 선, 페이지 가장자리
  lineSoft: "transparent", // 라이트에서만 보이는 얇은 테두리
  accent: "#ffd84d", // 연속 기록, 최신 점수, 선택된 탭
  highlight: "#ffd84d", // 오늘 칸, 재답변 뱃지
  highlighter: "transparent", // 큰 날짜 뒤 형광펜 (라이트에서만)
  onHighlight: "#000000",
  buttonBg: "#f5f5f2",
  buttonText: "#000000",
  danger: "#ff6b5b",
  chartBase: "#48484a", // 차트 바닥선
  chartDot: "#000000", // 차트 점 속

  // v3 이름
  bgPrimary: "#1c1c1e",
  bgSecondary: "#000000",
  bgHeader: "#000000",
  textPrimary: "#f5f5f2",
  textTertiary: "#a0a3a8",
  textBrand: "#ffd84d",
  borderDefault: "#3a3a3c",
  borderStrong: "#3a3a3c",
  borderFocus: "#f5f5f2",
  bgTertiary: "#1c1c1e",
  bgBrandSubtle: "rgba(28,28,30,0.5)",
  textSecondary: "#a0a3a8",
  textAccent: "#ffd84d",
  textDanger: "#ff6b5b",
  textOnAccent: "#000000",
  accentStrong: "#ffd84d",
  mascotFace: "#141414",
  mascotTop: "#fffbea",
  mascotMid: "#fff0bf",
  mascotBottom: "#f3d98a",
  bgSky: "#1c1c1e",
  bgInverse: "#f5f5f2",
  textInverse: "#000000",
  textSuccess: "#6debb8",
  bgSuccessSubtle: "#12302a",
  textWarning: "#ffd84d",
  focusRing: "rgba(245,245,242,0.18)",
  scrim: "rgba(0,0,0,0.6)",
  actionDefault: "#f5f5f2",
} as const;

export type ThemeColors = { [K in keyof typeof darkColors]: string };

export const lightColors: ThemeColors = {
  // v4
  bg: "#ffffff",
  surface: "#ffffff",
  surfaceMuted: "#f4f4f1",
  text: "#000000",
  textSub: "#63666b",
  textFaint: "#9c9fa3",
  line: "#d9dad5",
  lineSoft: "#e6e6e1",
  accent: "#f23c1f",
  highlight: "#ffe347",
  highlighter: "#ffe347",
  onHighlight: "#000000",
  buttonBg: "#000000",
  buttonText: "#ffffff",
  danger: "#f23c1f",
  chartBase: "#c9cac5",
  chartDot: "#f0f0ec",

  // v3 이름
  bgPrimary: "#ffffff",
  bgSecondary: "#ffffff",
  bgHeader: "#ffffff",
  textPrimary: "#000000",
  textTertiary: "#63666b",
  textBrand: "#f23c1f",
  borderDefault: "#d9dad5",
  borderStrong: "#d9dad5",
  borderFocus: "#000000",
  bgTertiary: "#f4f4f1",
  bgBrandSubtle: "#f4f4f1",
  textSecondary: "#63666b",
  textAccent: "#f23c1f",
  textDanger: "#f23c1f",
  textOnAccent: "#ffffff",
  accentStrong: "#f23c1f",
  mascotFace: "#141414",
  mascotTop: "#fff4b8",
  mascotMid: "#ffdb4d",
  mascotBottom: "#ffbe1a",
  bgSky: "#f4f4f1",
  bgInverse: "#000000",
  textInverse: "#ffffff",
  textSuccess: "#118059",
  bgSuccessSubtle: "#eafff6",
  textWarning: "#8a5a00",
  focusRing: "rgba(0,0,0,0.08)",
  scrim: "rgba(0,0,0,0.4)",
  actionDefault: "#000000",
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
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

// 커스텀 폰트는 굵기마다 파일이 따로라 fontWeight 대신 fontFamily 로 굵기를 고름
// (이름은 app/_layout.tsx 에서 useFonts 로 불러온 키와 같아야 함)
export const fonts = {
  regular: "IBMPlexSansKR_400Regular",
  medium: "IBMPlexSansKR_500Medium",
  semibold: "IBMPlexSansKR_600SemiBold",
  bold: "IBMPlexSansKR_700Bold",
  pen: "NanumPenScript_400Regular", // 손글씨 점수, 연속 기록
} as const;

export const fontFamily = {
  base: fonts.regular,
} as const;

// v3 이름의 글자 스타일. 굵기에 맞는 폰트 파일로 연결해 둠
export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 40, lineHeight: 50, letterSpacing: -1.2 },
  h2: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 38, letterSpacing: 0 },
  h3: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  h4: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28, letterSpacing: 0 },
  bodyLarge: { fontFamily: fonts.regular, fontSize: 18, lineHeight: 28, letterSpacing: 0 },
  bodyMedium: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodySmall: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  labelLarge: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  labelMedium: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  labelSmall: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  score: { fontFamily: fonts.pen, fontSize: 56, lineHeight: 56, letterSpacing: 0 },
} as const;

import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

function RootStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgSecondary },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}

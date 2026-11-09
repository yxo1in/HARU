import { Stack } from "expo-router";
import { darkColors } from "@/constants/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: darkColors.bgSecondary },
      }}
    />
  );
}

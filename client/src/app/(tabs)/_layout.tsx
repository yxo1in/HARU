import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabButton } from "@/components/tab-button";
import { spacing, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

const TABS = [
  {
    name: "home",
    href: "/home",
    label: "오늘",
    icon: "tabHome",
    activeIcon: "tabHomeActive",
  },
  {
    name: "question",
    href: "/question",
    label: "질문",
    icon: "tabQuestion",
    activeIcon: "tabQuestionActive",
  },
  {
    name: "record",
    href: "/record",
    label: "기록",
    icon: "tabRecord",
    activeIcon: "tabRecordActive",
  },
  {
    name: "profile",
    href: "/profile",
    label: "내 정보",
    icon: "tabProfile",
    activeIcon: "tabProfileActive",
  },
] as const;

export default function TabsLayout() {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList style={[styles.tabList, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        {TABS.map(({ name, href, label, icon, activeIcon }) => (
          <TabTrigger key={name} name={name} href={href} asChild>
            <TabButton label={label} icon={assets[icon]} activeIcon={assets[activeIcon]} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // TabSlot 기본값이 flexShrink: 0이라 긴 화면이 탭 바를 밀어내지 않게 높이를 제한함
  slot: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  tabList: {
    // v4 탭 바: 위쪽 선 + 9px 여백, 좌우 12px, 버튼 4개가 같은 폭
    paddingTop: 9,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
  },
});

import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabButton } from "@/components/tab-button";
import { darkColors, spacing } from "@/constants/theme";

const TABS = [
  {
    name: "home",
    href: "/home",
    label: "홈",
    icon: require("@/assets/images/icons/tab-home.svg"),
    activeIcon: require("@/assets/images/icons/tab-home-active.svg"),
  },
  {
    name: "question",
    href: "/question",
    label: "질문",
    icon: require("@/assets/images/icons/tab-question.svg"),
    activeIcon: require("@/assets/images/icons/tab-question-active.svg"),
  },
  {
    name: "record",
    href: "/record",
    label: "기록",
    icon: require("@/assets/images/icons/tab-record.svg"),
    activeIcon: require("@/assets/images/icons/tab-record-active.svg"),
  },
  {
    name: "profile",
    href: "/profile",
    label: "프로필",
    icon: require("@/assets/images/icons/tab-profile.svg"),
    activeIcon: require("@/assets/images/icons/tab-profile-active.svg"),
  },
] as const;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList style={[styles.tabList, { paddingBottom: insets.bottom }]}>
        {TABS.map(({ name, href, label, icon, activeIcon }) => (
          <TabTrigger key={name} name={name} href={href} asChild>
            <TabButton label={label} icon={icon} activeIcon={activeIcon} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkColors.bgSecondary,
  },
  // TabSlot 기본값이 flexShrink: 0이라 긴 화면이 탭 바를 밀어내지 않게 높이를 제한함
  slot: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  tabList: {
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: darkColors.borderDefault,
    backgroundColor: darkColors.bgPrimary,
  },
});

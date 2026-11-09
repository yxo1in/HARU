import { Image } from "expo-image";
import { router } from "expo-router";
import { Fragment, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenHeader } from "@/components/screen-header";
import { ThemeSheet } from "@/components/theme-sheet";
import { darkColors, radius, spacing, typography } from "@/constants/theme";

// API 연동 전까지 쓰는 Figma 예시 데이터
const SETTINGS = [
  { label: "희망 직무", value: "백엔드" },
  { label: "닉네임", value: "기진" },
  { label: "비밀번호 변경" },
];

type ListRowProps = {
  label: string;
  value?: string;
  chevron?: boolean;
  danger?: boolean;
  onPress?: () => void;
};

function ListRow({ label, value, chevron, danger, onPress }: ListRowProps) {
  return (
    <Pressable style={styles.row} accessibilityRole="button" onPress={onPress}>
      <Text style={danger ? styles.rowLabelDanger : styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {chevron ? (
          <Image
            source={require("@/assets/images/icons/chevron.svg")}
            style={styles.chevron}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

export default function Profile() {
  const [theme, setTheme] = useState("시간대별");
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);

  return (
    <View style={styles.container}>
      <ScreenHeader title="프로필" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Image
              source={require("@/assets/images/mascot/haru-profile.png")}
              style={styles.haru}
            />
          </View>
          <View style={styles.who}>
            <Text style={styles.name}>기진</Text>
            <Text style={styles.email}>haru@example.com</Text>
          </View>
        </View>

        <View style={styles.card}>
          {SETTINGS.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <ListRow {...item} chevron />
            </Fragment>
          ))}
          <View style={styles.divider} />
          <ListRow
            label="화면 테마"
            value={theme}
            chevron
            onPress={() => setThemeSheetOpen(true)}
          />
        </View>

        <View style={styles.card}>
          <ListRow label="로그아웃" onPress={() => router.replace("/")} />
          <View style={styles.divider} />
          <ListRow label="회원 탈퇴" danger />
        </View>
      </ScrollView>

      <ThemeSheet
        visible={themeSheetOpen}
        selected={theme}
        onSelect={(label) => {
          setTheme(label);
          setThemeSheetOpen(false);
        }}
        onClose={() => setThemeSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkColors.bgSecondary,
  },
  scroll: {
    flex: 1,
  },
  body: {
    gap: spacing["2xl"],
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
  },
  haru: {
    position: "absolute",
    left: -19,
    top: -18,
    width: 110,
    height: 110,
  },
  who: {
    gap: 2,
  },
  name: {
    ...typography.h3,
    color: darkColors.textPrimary,
  },
  email: {
    ...typography.bodySmall,
    color: darkColors.textTertiary,
  },
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: darkColors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: darkColors.bgPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: darkColors.borderDefault,
  },
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: darkColors.textPrimary,
  },
  rowLabelDanger: {
    ...typography.bodyMedium,
    color: darkColors.textDanger,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  rowValue: {
    ...typography.bodyMedium,
    color: darkColors.textTertiary,
  },
  chevron: {
    width: 20,
    height: 20,
  },
});

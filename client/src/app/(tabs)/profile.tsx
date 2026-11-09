import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { JobSheet, NicknameSheet, PasswordSheet } from "@/components/profile-sheets";
import { ScreenHeader } from "@/components/screen-header";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { ThemeSheet } from "@/components/theme-sheet";
import { radius, spacing, typography, type ThemeColors } from "@/constants/theme";

type ListRowProps = {
  label: string;
  value?: string;
  chevron?: boolean;
  danger?: boolean;
  onPress?: () => void;
};

function ListRow({ label, value, chevron, danger, onPress }: ListRowProps) {
  const styles = useThemedStyles(createStyles);
  const { assets } = useTheme();

  return (
    <Pressable style={styles.row} accessibilityRole="button" onPress={onPress}>
      <Text style={danger ? styles.rowLabelDanger : styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {chevron ? <Image source={assets.chevron} style={styles.chevron} /> : null}
      </View>
    </Pressable>
  );
}

type OpenSheet = "job" | "nickname" | "password" | "theme" | null;

export default function Profile() {
  const styles = useThemedStyles(createStyles);
  const { assets, preference } = useTheme();
  // API 연동 전까지 이 화면 안에서만 유지되는 Figma 예시 값
  const [job, setJob] = useState("백엔드");
  const [nickname, setNickname] = useState("기진");
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const closeSheet = () => setOpenSheet(null);

  return (
    <View style={styles.container}>
      <ScreenHeader title="프로필" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Image source={assets.haruProfile} style={styles.haru} />
          </View>
          <View style={styles.who}>
            <Text style={styles.name}>{nickname}</Text>
            <Text style={styles.email}>haru@example.com</Text>
          </View>
        </View>

        <View style={styles.card}>
          <ListRow label="희망 직무" value={job} chevron onPress={() => setOpenSheet("job")} />
          <View style={styles.divider} />
          <ListRow
            label="닉네임"
            value={nickname}
            chevron
            onPress={() => setOpenSheet("nickname")}
          />
          <View style={styles.divider} />
          <ListRow label="비밀번호 변경" chevron onPress={() => setOpenSheet("password")} />
          <View style={styles.divider} />
          <ListRow
            label="화면 테마"
            value={preference}
            chevron
            onPress={() => setOpenSheet("theme")}
          />
        </View>

        <View style={styles.card}>
          <ListRow label="로그아웃" onPress={() => router.replace("/")} />
          <View style={styles.divider} />
          <ListRow label="회원 탈퇴" danger />
        </View>
      </ScrollView>

      {openSheet === "job" ? (
        <JobSheet selected={job} onSelect={setJob} onClose={closeSheet} />
      ) : null}
      {openSheet === "nickname" ? (
        <NicknameSheet initialValue={nickname} onSave={setNickname} onClose={closeSheet} />
      ) : null}
      {openSheet === "password" ? <PasswordSheet onClose={closeSheet} /> : null}
      {openSheet === "theme" ? <ThemeSheet onClose={closeSheet} /> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
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
  // Figma Haru 박스(120) 위치. 라이트 모드의 햇살까지 이 박스 안에 들어감
  haru: {
    position: "absolute",
    left: -24,
    top: -18,
    width: 120,
    height: 120,
  },
  who: {
    gap: 2,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  email: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    backgroundColor: colors.bgPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDefault,
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
    color: colors.textPrimary,
  },
  rowLabelDanger: {
    ...typography.bodyMedium,
    color: colors.textDanger,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  rowValue: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  chevron: {
    width: 20,
    height: 20,
  },
});

import { Image } from "expo-image";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import {
  JobSheet,
  NicknameSheet,
  PasswordSheet,
} from "@/components/profile-sheets";
import { ScreenHeader } from "@/components/screen-header";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { ThemeSheet } from "@/components/theme-sheet";
import {
  radius,
  spacing,
  typography,
  type ThemeColors,
} from "@/constants/theme";
import { getToken, removeToken } from "@/lib/token";
import { JOB_ROLE_NAMES, JOBS } from "@/constants/jobs";

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
      <Text style={danger ? styles.rowLabelDanger : styles.rowLabel}>
        {label}
      </Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {chevron ? (
          <Image source={assets.chevron} style={styles.chevron} />
        ) : null}
      </View>
    </Pressable>
  );
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type OpenSheet = "job" | "nickname" | "password" | "theme" | null;

export default function Profile() {
  const styles = useThemedStyles(createStyles);
  const { assets, preference } = useTheme();
  type profileData = {
    nickname: string;
    jobRoleId: number | null;
    jobRoleName: string | null;
    email: string | null;
  };
  const [profile, setProfile] = useState<profileData | null>(null);
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const [notice, setNotice] = useState("");
  const closeSheet = () => setOpenSheet(null);

  // 안내 문구는 3초 뒤에 사라짐
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          await removeToken();
          router.replace("/");
          return;
        }
        if (!res.ok) throw new Error(`status ${res.status}`);
        setProfile(await res.json());
      } catch (e) {
        console.log("profile load failed:", e, API_URL);
        setNotice("프로필을 불러오지 못했어요.");
      }
    })();
  }, []);

  const handleUpdateJob = async (newJob: string) => {
    try {
      const newJobRoleId = JOBS.indexOf(newJob) + 1;
      // console.log(newJobRoleId);
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/updateJob`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newJobRoleId }),
      });
      if (res.status === 401) {
        await removeToken();
        router.replace("/");
        return null;
      }
      if (!res.ok) {
        const data = await res.json();
        return data.error ?? "직무를 바꾸지 못했어요.";
      }
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              jobRoleId: newJobRoleId,
              jobRoleName: JOB_ROLE_NAMES[newJob],
            }
          : prev,
      );
      closeSheet();
      setNotice("직무를 변경했어요.");
      return null;
    } catch {
      return "서버에 연결할 수 없어요.";
    }
  };
  // 실패하면 에러 문구를 돌려줘서 시트에 보여줌
  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/updatePassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.status === 401) {
        await removeToken();
        router.replace("/");
        return null;
      }
      if (!res.ok) {
        const data = await res.json();
        return data.error ?? "비밀번호를 바꾸지 못했어요.";
      }
      closeSheet();
      setNotice("비밀번호를 변경했어요.");
      return null;
    } catch {
      return "서버에 연결할 수 없어요.";
    }
  };

  const deleteUser = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/deleteUser`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.ok) {
        await removeToken();
        router.replace("/");
        return;
      }
      Alert.alert("탈퇴하지 못했어요", "잠시 후 다시 시도해 주세요.");
    } catch {
      Alert.alert("서버에 연결할 수 없어요", "네트워크를 확인해 주세요.");
    }
  };

  const confirmDeleteUser = () => {
    const message =
      "탈퇴하면 계정과 기록이 모두 삭제되고 되돌릴 수 없어요. 정말 탈퇴할까요?";

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        deleteUser();
      }
      return;
    }

    Alert.alert("회원 탈퇴", message, [
      { text: "취소", style: "cancel" },
      { text: "탈퇴", style: "destructive", onPress: deleteUser },
    ]);
  };

  const logout = async () => {
    await removeToken();
    router.replace("/");
  };

  if (!profile) {
    return null;
  }
  const { nickname, jobRoleName, email } = profile;
  const job = Object.keys(JOB_ROLE_NAMES).find(
    (key) => JOB_ROLE_NAMES[key] === jobRoleName,
  );

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
            {email ? <Text style={styles.email}>{email}</Text> : null}
          </View>
        </View>

        <View style={styles.card}>
          <ListRow
            label="희망 직무"
            value={job}
            chevron
            onPress={() => setOpenSheet("job")}
          />
          <View style={styles.divider} />
          <ListRow
            label="닉네임"
            value={nickname}
            chevron
            onPress={() => setOpenSheet("nickname")}
          />
          <View style={styles.divider} />
          <ListRow
            label="비밀번호 변경"
            chevron
            onPress={() => setOpenSheet("password")}
          />
          <View style={styles.divider} />
          <ListRow
            label="화면 테마"
            value={preference}
            chevron
            onPress={() => setOpenSheet("theme")}
          />
        </View>

        <View style={styles.card}>
          <ListRow label="로그아웃" onPress={logout} />
          <View style={styles.divider} />
          <ListRow label="회원 탈퇴" danger onPress={confirmDeleteUser} />
        </View>
      </ScrollView>

      {notice ? (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{notice}</Text>
        </View>
      ) : null}

      {openSheet === "job" ? (
        <JobSheet
          selected={job ?? ""}
          onSelect={handleUpdateJob}
          onClose={closeSheet}
        />
      ) : null}
      {openSheet === "nickname" ? (
        <NicknameSheet
          initialValue={nickname}
          onSave={() => {}}
          onClose={closeSheet}
        />
      ) : null}
      {openSheet === "password" ? (
        <PasswordSheet onSave={handleUpdatePassword} onClose={closeSheet} />
      ) : null}
      {openSheet === "theme" ? <ThemeSheet onClose={closeSheet} /> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    // 화면 하단에 떠 있는 안내 문구
    toast: {
      position: "absolute",
      left: spacing.xl,
      right: spacing.xl,
      bottom: spacing.xl,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.bgInverse,
      alignItems: "center",
    },
    toastText: {
      ...typography.bodySmall,
      color: colors.textInverse,
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

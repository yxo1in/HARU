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
} from "react-native";
import {
  JobSheet,
  NicknameSheet,
  PasswordSheet,
} from "@/components/profile-sheets";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenHeader } from "@/components/screen-header";
import { useTheme, useThemedStyles } from "@/components/theme-provider";
import { ThemeSheet } from "@/components/theme-sheet";
import { fonts, radius, spacing, type ThemeColors } from "@/constants/theme";
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
          <Image source={assets.v4ChevronRight} style={styles.chevron} />
        ) : null}
      </View>
    </Pressable>
  );
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type OpenSheet = "job" | "nickname" | "password" | "theme" | null;

export default function Profile() {
  const styles = useThemedStyles(createStyles);
  const { preference } = useTheme();
  type profileData = {
    nickname: string;
    jobRoleId: number | null;
    jobRoleName: string | null;
    email: string | null;
    loginId: string | null;
    answerCount: number;
  };
  const [profile, setProfile] = useState<profileData | null>(null);
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const [notice, setNotice] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
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

  const updateNickname = async (newNickname: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/profile/updateNickname`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newNickname }),
      });
      if (res.status === 401) {
        await removeToken();
        router.replace("/");
        return null;
      }
      if (!res.ok) {
        const data = await res.json();
        return data.error ?? "닉네임을 바꾸지 못했어요.";
      }
      setProfile((prev) => (prev ? { ...prev, nickname: newNickname } : prev));
      closeSheet();
      setNotice("닉네임을 변경했어요.");
      return null;
    } catch (err) {
      console.log(err);
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

  const confirmDeleteUser = () => setConfirmingDelete(true);

  const logout = async () => {
    await removeToken();
    router.replace("/");
  };

  if (!profile) {
    return null;
  }
  const { nickname, jobRoleName, email, loginId, answerCount } = profile;
  const job = Object.keys(JOB_ROLE_NAMES).find(
    (key) => JOB_ROLE_NAMES[key] === jobRoleName,
  );
  // 아이디 가입이면 아이디, 구글 가입이면 이메일
  const joinedWith = loginId ? `아이디 ${loginId}로 가입` : email;

  return (
    <View style={styles.container}>
      <ScreenHeader title="내 정보" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname.slice(0, 1)}</Text>
          </View>
          <View style={styles.who}>
            <Text style={styles.name}>{nickname}</Text>
            {joinedWith ? <Text style={styles.email}>{joinedWith}</Text> : null}
          </View>
        </View>

        <View style={styles.card}>
          <ListRow
            label="닉네임"
            value={nickname}
            chevron
            onPress={() => setOpenSheet("nickname")}
          />
          <View style={styles.divider} />
          <ListRow
            label="희망 직무"
            value={jobRoleName ?? "선택 안 함"}
            chevron
            onPress={() => setOpenSheet("job")}
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
          <ListRow label="로그아웃" chevron onPress={logout} />
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
          onSave={updateNickname}
          onClose={closeSheet}
        />
      ) : null}
      {openSheet === "password" ? (
        <PasswordSheet onSave={handleUpdatePassword} onClose={closeSheet} />
      ) : null}
      {openSheet === "theme" ? <ThemeSheet onClose={closeSheet} /> : null}
      {confirmingDelete ? (
        <ConfirmDialog
          title="정말 탈퇴할까요?"
          message={`답변 ${answerCount}개와 첨삭, 나만의 질문이 모두 지워져요. 지운 기록은 되돌릴 수 없어요.`}
          confirmLabel="탈퇴하기"
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false);
            deleteUser();
          }}
        />
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    scroll: {
      flex: 1,
    },
    body: {
      gap: 20,
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing["2xl"],
    },
    profile: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    // 닉네임 첫 글자를 넣은 동그라미
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.buttonBg,
    },
    avatarText: {
      fontFamily: fonts.bold,
      fontSize: 22,
      letterSpacing: -0.22,
      color: colors.buttonText,
    },
    who: {
      flex: 1,
      gap: 2,
    },
    name: {
      fontFamily: fonts.bold,
      fontSize: 20,
      letterSpacing: -0.2,
      color: colors.text,
    },
    email: {
      fontFamily: fonts.regular,
      fontSize: 14,
      color: colors.textSub,
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
      backgroundColor: colors.buttonBg,
      alignItems: "center",
    },
    toastText: {
      fontFamily: fonts.medium,
      fontSize: 14,
      color: colors.buttonText,
    },
    card: {
      paddingLeft: 18,
      paddingRight: 14,
      borderWidth: 1,
      borderColor: colors.lineSoft,
      borderRadius: 14,
      backgroundColor: colors.surface,
    },
    divider: {
      height: 1,
      backgroundColor: colors.line,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 15,
    },
    rowLabel: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 16,
      color: colors.text,
    },
    rowLabelDanger: {
      flex: 1,
      fontFamily: fonts.regular,
      fontSize: 16,
      color: colors.danger,
    },
    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    rowValue: {
      fontFamily: fonts.regular,
      fontSize: 15,
      color: colors.textSub,
    },
    chevron: {
      width: 16,
      height: 16,
    },
  });

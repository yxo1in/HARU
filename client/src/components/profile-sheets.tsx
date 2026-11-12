import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { TextField } from "@/components/text-field";
import { JOBS } from "@/constants/jobs";
import { spacing, typography } from "@/constants/theme";
import { useTheme } from "@/components/theme-provider";

const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 10;

type JobSheetProps = {
  selected: string;
  onSelect: (job: string) => void;
  onClose: () => void;
};

export function JobSheet({ selected, onSelect, onClose }: JobSheetProps) {
  return (
    <BottomSheet title="희망 직무" subtitle="직무에 맞춰 질문을 만들어요" onClose={onClose}>
      <View style={styles.chips}>
        {JOBS.map((job) => (
          <Chip
            key={job}
            label={job}
            selected={job === selected}
            onPress={() => {
              onSelect(job);
              onClose();
            }}
          />
        ))}
      </View>
    </BottomSheet>
  );
}

type NicknameSheetProps = {
  initialValue: string;
  onSave: (nickname: string) => void;
  onClose: () => void;
};

export function NicknameSheet({ initialValue, onSave, onClose }: NicknameSheetProps) {
  const [nickname, setNickname] = useState(initialValue);
  const trimmed = nickname.trim();

  return (
    <BottomSheet title="닉네임" onClose={onClose}>
      <View style={styles.form}>
        <TextField
          label="닉네임"
          placeholder="2~10자로 입력"
          value={nickname}
          onChangeText={setNickname}
          maxLength={NICKNAME_MAX_LENGTH}
        />
        <Button
          label="저장"
          disabled={trimmed.length < NICKNAME_MIN_LENGTH}
          onPress={() => {
            onSave(trimmed);
            onClose();
          }}
        />
      </View>
    </BottomSheet>
  );
}

type PasswordSheetProps = {
  // 실패하면 에러 문구, 성공하면 null을 돌려줌
  onSave: (currentPassword: string, newPassword: string) => Promise<string | null>;
  onClose: () => void;
};

export function PasswordSheet({ onSave, onClose }: PasswordSheetProps) {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    const message = await onSave(currentPassword, newPassword);
    setSaving(false);
    if (message) setError(message);
  };

  return (
    <BottomSheet title="비밀번호 변경" onClose={onClose}>
      <View style={styles.form}>
        <TextField
          label="현재 비밀번호"
          placeholder="현재 비밀번호 입력"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secure
        />
        <TextField
          label="새 비밀번호"
          placeholder="새 비밀번호 입력"
          helper="8자 이상, 영문과 숫자를 섞어 주세요"
          value={newPassword}
          onChangeText={setNewPassword}
          secure
        />
        {error ? (
          <Text style={[typography.caption, { color: colors.textDanger }]}>
            {error}
          </Text>
        ) : null}
        <Button
          label="변경하기"
          disabled={!currentPassword || !newPassword || saving}
          onPress={handleSave}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
});

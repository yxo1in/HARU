import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheet } from "@/components/bottom-sheet";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { TextField } from "@/components/text-field";
import { JOBS } from "@/constants/jobs";
import { spacing } from "@/constants/theme";

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

export function PasswordSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet title="비밀번호 변경" onClose={onClose}>
      <View style={styles.form}>
        <TextField label="현재 비밀번호" placeholder="현재 비밀번호 입력" secure />
        <TextField
          label="새 비밀번호"
          placeholder="새 비밀번호 입력"
          helper="8자 이상, 영문과 숫자를 섞어 주세요"
          secure
        />
        <Button label="변경하기" onPress={onClose} />
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

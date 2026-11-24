import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { useThemedStyles } from "@/components/theme-provider";
import { fonts, spacing, type ThemeColors } from "@/constants/theme";

// v4 가운데 확인 창: 제목 + 설명 + [취소] [확인] 두 버튼. 확인 버튼은 위험(빨간 테두리) 모양
type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable style={styles.scrim} accessibilityLabel="닫기" onPress={onCancel} />
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.spacer} />
          <View style={styles.buttons}>
            <Button label={cancelLabel} variant="secondary" style={styles.button} onPress={onCancel} />
            <Button label={confirmLabel} variant="danger" style={styles.button} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scrim,
  },
  dialog: {
    gap: 10,
    paddingTop: spacing.xl,
    paddingHorizontal: 22,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: colors.lineSoft,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.2,
    color: colors.text,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSub,
  },
  spacer: {
    height: spacing.sm,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
});

import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { fonts, noWebOutline, spacing, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

// v4 입력칸: 위 라벨 + 52px 칸 + 아래 도움말
//  - valid: 진한 테두리 + 오른쪽 체크 (중복 확인 통과 등)
//  - error: 빨간 테두리 + 빨간 도움말
//  - 입력 중(포커스)일 때도 진한 테두리
type TextFieldProps = Pick<
  TextInputProps,
  "placeholder" | "autoCapitalize" | "autoComplete" | "value" | "onChangeText" | "maxLength"
> & {
  label: string;
  helper?: string;
  secure?: boolean;
  state?: "default" | "valid" | "error";
};

export function TextField({ label, helper, secure, state = "default", ...inputProps }: TextFieldProps) {
  const styles = useThemedStyles(createStyles);
  const { assets, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          (focused || state === "valid") && styles.fieldStrong,
          state === "error" && styles.fieldError,
        ]}
      >
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={secure && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {state === "valid" ? <Image source={assets.v4FieldCheck} style={styles.check} /> : null}
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="비밀번호 보기"
            hitSlop={spacing.sm}
            onPress={() => setHidden((value) => !value)}
          >
            <Text style={styles.toggle}>{hidden ? "보기" : "숨기기"}</Text>
          </Pressable>
        ) : null}
      </View>
      {helper ? (
        <Text style={state === "error" ? styles.helperError : styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 52,
    paddingLeft: spacing.lg,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  fieldStrong: {
    borderWidth: 1.5,
    borderColor: colors.text,
  },
  fieldError: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  // TextInput에 lineHeight를 주면 iOS에서 글자 위치가 어긋나서 크기만 지정함
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    ...noWebOutline,
  },
  check: {
    width: 20,
    height: 20,
  },
  toggle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSub,
  },
  helper: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSub,
  },
  helperError: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.danger,
  },
});

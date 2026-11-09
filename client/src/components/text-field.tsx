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
import { darkColors, fontFamily, radius, spacing, typography } from "@/constants/theme";

type TextFieldProps = Pick<TextInputProps, "placeholder" | "autoCapitalize" | "autoComplete"> & {
  label: string;
  helper?: string;
  secure?: boolean;
};

export function TextField({ label, helper, secure, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={darkColors.textTertiary}
          secureTextEntry={secure && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="비밀번호 보기"
            hitSlop={spacing.sm}
            onPress={() => setHidden((value) => !value)}
          >
            <Image source={require("@/assets/images/icons/eye.svg")} style={styles.eye} />
          </Pressable>
        ) : null}
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.labelMedium,
    color: darkColors.textSecondary,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: darkColors.borderDefault,
    borderRadius: radius.md,
    backgroundColor: darkColors.bgPrimary,
  },
  fieldFocused: {
    borderWidth: 1.5,
    borderColor: darkColors.borderFocus,
    boxShadow: `0px 0px 0px 2px ${darkColors.focusRing}`,
  },
  // TextInput에 lineHeight를 주면 iOS에서 글자 위치가 어긋나서 크기만 지정함
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontFamily: fontFamily.base,
    fontSize: 16,
    color: darkColors.textPrimary,
    outlineWidth: 0,
  },
  eye: {
    width: 24,
    height: 24,
  },
  helper: {
    ...typography.caption,
    color: darkColors.textTertiary,
  },
});

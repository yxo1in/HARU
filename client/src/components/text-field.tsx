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
import { fontFamily, noWebOutline, radius, spacing, typography, type ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/components/theme-provider";

type TextFieldProps = Pick<
  TextInputProps,
  "placeholder" | "autoCapitalize" | "autoComplete" | "value" | "onChangeText" | "maxLength"
> & {
  label: string;
  helper?: string;
  secure?: boolean;
};

export function TextField({ label, helper, secure, ...inputProps }: TextFieldProps) {
  const styles = useThemedStyles(createStyles);
  const { assets, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={colors.textTertiary}
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
            <Image source={assets.eye} style={styles.eye} />
          </Pressable>
        ) : null}
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    backgroundColor: colors.bgPrimary,
  },
  fieldFocused: {
    borderWidth: 1.5,
    borderColor: colors.borderFocus,
    boxShadow: `0px 0px 0px 2px ${colors.focusRing}`,
  },
  // TextInput에 lineHeight를 주면 iOS에서 글자 위치가 어긋나서 크기만 지정함
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontFamily: fontFamily.base,
    fontSize: 16,
    color: colors.textPrimary,
    ...noWebOutline,
  },
  eye: {
    width: 24,
    height: 24,
  },
  helper: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});

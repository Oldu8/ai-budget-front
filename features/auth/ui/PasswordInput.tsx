import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { ThemedText } from '@/shared/ui/ThemedText';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { Colors } from '@/shared/constants/theme';

export interface PasswordInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  editable?: boolean;
}

export function PasswordInput({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setFocused(false);
    onBlur?.(e);
  };

  const wrapperStyle = [
    styles.inputWrapper,
    error ? styles.inputError : null,
    focused && !error ? styles.inputFocused : null,
  ];

  return (
    <View style={styles.container}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      <View style={wrapperStyle}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          style={styles.toggle}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          <IconSymbol
            name={visible ? 'eye.slash.fill' : 'eye.fill'}
            size={20}
            color={Colors.grey}
          />
        </Pressable>
      </View>
      <View style={styles.errorSlot}>
        {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      </View>
    </View>
  );
}

const ERROR_SLOT_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.greyHover,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.black,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  toggle: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorSlot: {
    height: ERROR_SLOT_HEIGHT,
    justifyContent: 'center',
  },
  errorText: {
    position: 'absolute',
    fontSize: 12,
    color: Colors.error,
    left: 0,
  },
});

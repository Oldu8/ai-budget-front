import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

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
  ...rest
}: PasswordInputProps) {
  return (
    <>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry
        editable={editable}
        {...rest}
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.greyHover,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
});

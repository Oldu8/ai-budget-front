import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

const ERROR_SLOT_HEIGHT = 20;

export interface EmailInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  editable?: boolean;
}

export function EmailInput({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  editable = true,
  ...rest
}: EmailInputProps) {
  return (
    <View style={styles.container}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={Colors.grey}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
        {...rest}
      />
      <View style={styles.errorSlot}>
        {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
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

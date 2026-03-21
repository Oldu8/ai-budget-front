import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { Colors } from '@/shared/constants/theme';
import { getCurrencySymbol } from '@/shared/lib/getCurrencySymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

interface AmountInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
}

function formatAmount(value: number): string {
  if (!value) return '0.00';
  return value.toFixed(2);
}

function sanitizeAmountInput(input: string): string {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');

  if (parts.length === 1) return cleaned;

  const integerPart = parts[0];
  const decimalPart = parts.slice(1).join('').slice(0, 2);

  return `${integerPart}.${decimalPart}`;
}

function parseAmount(input: string): number {
  if (!input || input === '.') return 0;
  const parsed = Number(input);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function AmountInput<T extends FieldValues>({
  control,
  name,
  disabled = false,
}: AmountInputProps<T>) {
  const inputRef = useRef<TextInput>(null);
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');
  const symbol = getCurrencySymbol(currency);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <AmountInputInner
          value={typeof value === 'number' ? value : 0}
          onChange={onChange}
          symbol={symbol}
          disabled={disabled}
          inputRef={inputRef}
        />
      )}
    />
  );
}

function AmountInputInner({
  value,
  onChange,
  symbol,
  disabled,
  inputRef,
}: {
  value: number;
  onChange: (v: number) => void;
  symbol: string;
  disabled?: boolean;
  inputRef: React.RefObject<TextInput | null>;
}) {
  const [rawString, setRawString] = useState(formatAmount(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setRawString(formatAmount(value));
    }
  }, [value, isFocused]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    inputRef.current?.focus();
  }, [disabled, inputRef]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);

    if (rawString === '0.00') {
      setRawString('');
    }
  }, [rawString]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    if (!rawString || rawString === '.') {
      setRawString('0.00');
      onChange(0);
      return;
    }

    const parsed = parseAmount(rawString);
    setRawString(formatAmount(parsed));
    onChange(parsed);
  }, [rawString, onChange]);

  const handleChangeText = useCallback(
    (text: string) => {
      const sanitized = sanitizeAmountInput(text);
      setRawString(sanitized);
      onChange(parseAmount(sanitized));
    },
    [onChange]
  );

  const displayValue = rawString || '0.00';

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={styles.displayWrapper}
      >
        <ThemedText style={styles.display}>
          {symbol}
          {displayValue}
        </ThemedText>
      </Pressable>

      <TextInput
        ref={inputRef}
        value={rawString}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        keyboardType="decimal-pad"
        inputMode="decimal"
        style={styles.hiddenInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 28,
  },
  displayWrapper: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
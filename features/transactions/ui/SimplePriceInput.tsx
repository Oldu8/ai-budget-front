import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { Colors } from '@/shared/constants/theme';
import { getCurrencySymbol } from '@/shared/lib/getCurrencySymbol';
import { groupThousands } from '@/shared/lib/groupThousands';
import { ThemedText } from '@/shared/ui/ThemedText';

function formatPlainTwoDecimals(value: number): string {
  if (!Number.isFinite(value) || value === 0) return '';
  return value.toFixed(2);
}

/** Settled (not-focused) display only — editing starts from the ungrouped plain text
 * so backspacing never has to skip over a grouping space. */
function formatGroupedTwoDecimals(value: number): string {
  const plain = formatPlainTwoDecimals(value);
  return plain ? groupThousands(plain) : plain;
}

/** Matches the 1,000,000 form max — typing an 8th integer digit is simply ignored. */
const MAX_INTEGER_DIGITS = 7;

/** Normalize comma decimal to dot; keep digits and at most one dot. */
function sanitizeDecimalInput(input: string): string {
  const normalized = input.replace(/,/g, '.');
  const cleaned = normalized.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const integerPart = parts[0].slice(0, MAX_INTEGER_DIGITS);
  if (parts.length <= 1) return integerPart;
  return `${integerPart}.${parts.slice(1).join('').slice(0, 2)}`;
}

function parseToMajorUnits(sanitized: string): number {
  if (!sanitized || sanitized === '.') return 0;
  const n = Number(sanitized);
  return Number.isFinite(n) ? n : 0;
}

/** Covers up to 9,999,999.99 — comfortably above the 1,000,000 form max. */
const MAX_AMOUNT_INPUT_LENGTH = 10;

type SimplePriceInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
};

export function SimplePriceInput<T extends FieldValues>({
  control,
  name,
  disabled = false,
}: SimplePriceInputProps<T>) {
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');
  const symbol = getCurrencySymbol(currency);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <SimplePriceInputInner
          value={typeof value === 'number' ? value : 0}
          onChange={onChange}
          symbol={symbol}
          disabled={disabled}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

function SimplePriceInputInner({
  value,
  onChange,
  symbol,
  disabled,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  symbol: string;
  disabled?: boolean;
  error?: string;
}) {
  const { t } = useTranslation();
  /** iOS `decimal-pad` has no Done key — toolbar above the keyboard. */
  const inputAccessoryNativeId = useRef(
    `simplePriceInputAccessory-${Math.random().toString(36).slice(2, 11)}`
  ).current;
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => formatGroupedTwoDecimals(value));
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (focused) return;
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setText(value > 0 ? formatGroupedTwoDecimals(value) : '');
    }
  }, [value, focused]);

  const handleChangeText = useCallback(
    (input: string) => {
      const sanitized = sanitizeDecimalInput(input);
      setText(sanitized);
      const major = parseToMajorUnits(sanitized);
      onChange(major);
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    setFocused(false);
    const sanitized = sanitizeDecimalInput(text);
    const major = parseToMajorUnits(sanitized);
    onChange(major);
    setText(major > 0 ? formatGroupedTwoDecimals(major) : '');
  }, [text, onChange]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (value > 0) {
      const s = formatPlainTwoDecimals(value);
      setText(s === '0.00' ? '' : s);
    }
  }, [value]);

  return (
    <View style={styles.wrap}>
      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={inputAccessoryNativeId}>
          <View style={styles.accessoryBar}>
            <Pressable onPress={Keyboard.dismiss} hitSlop={12}>
              <ThemedText style={styles.accessoryDone}>
                {t('buttons.done')}
              </ThemedText>
            </Pressable>
          </View>
        </InputAccessoryView>
      ) : null}
      <ThemedText lightColor={Colors.grey} style={styles.label}>
        {t('history.price')}
      </ThemedText>
      <View style={styles.row}>
        <ThemedText style={styles.currency}>{symbol}</ThemedText>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onFocus={handleFocus}
          editable={!disabled}
          keyboardType="decimal-pad"
          inputMode="decimal"
          inputAccessoryViewID={
            Platform.OS === 'ios' ? inputAccessoryNativeId : undefined
          }
          placeholder="0.00"
          placeholderTextColor={Colors.grey}
          maxLength={MAX_AMOUNT_INPUT_LENGTH}
          style={styles.input}
        />
      </View>
      <View style={styles.hintSlot}>
        {error ? (
          <ThemedText
            lightColor={Colors.error}
            style={styles.errorAbs}
            numberOfLines={2}
          >
            {error}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accessoryBar: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
  },
  accessoryDone: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
  },
  wrap: {
    alignSelf: 'stretch',
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: Colors.greyLow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.greyHover,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
    minWidth: 28,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    paddingVertical: 12,
    minHeight: 44,
  },
  /** Reserved space so layout does not jump; error is absolutely placed inside. */
  hintSlot: {
    position: 'relative',
    minHeight: 22,
    marginTop: 4,
  },
  errorAbs: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: 0,
    fontSize: 12,
    lineHeight: 16,
  },
});

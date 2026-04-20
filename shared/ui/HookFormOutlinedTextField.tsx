import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

/** Props for {@link HookFormOutlinedTextField} — bound to react-hook-form `control` + field `name`. */
export interface HookFormOutlinedTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  /** Visible caption (pass `t('…')` from the screen). */
  label: string;
  placeholder: string;
  disabled?: boolean;
  /**
   * `string`: keep `""` when cleared (receipt line item).
   * `nullIfEmpty`: store `null` when cleared (nullable string in zod, e.g. recurring label).
   */
  emptyHandling?: 'string' | 'nullIfEmpty';
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
}

/** Single-line text field wired to react-hook-form (`Controller` + outlined pill style). */
export function HookFormOutlinedTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  emptyHandling = 'string',
  maxLength,
  autoCapitalize,
  autoCorrect,
}: HookFormOutlinedTextFieldProps<T>) {
  return (
    <View style={styles.wrap}>
      <ThemedText
        lightColor={Colors.grey}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </ThemedText>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur }, fieldState }) => {
          const strVal =
            emptyHandling === 'nullIfEmpty'
              ? value === null || value === undefined
                ? ''
                : String(value)
              : typeof value === 'string'
                ? value
                : '';

          const handleChange = (text: string) => {
            if (emptyHandling === 'nullIfEmpty') {
              const next =
                maxLength != null ? text.slice(0, maxLength) : text;
              onChange(next.length === 0 ? null : next);
              return;
            }
            onChange(text);
          };

          return (
            <>
              <TextInput
                value={strVal}
                onChangeText={handleChange}
                onBlur={onBlur}
                editable={!disabled}
                placeholder={placeholder}
                placeholderTextColor={Colors.grey}
                style={styles.input}
                maxLength={maxLength}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
              />
              {fieldState.error?.message ? (
                <ThemedText
                  style={styles.error}
                  lightColor={Colors.error}
                  numberOfLines={2}
                >
                  {fieldState.error.message}
                </ThemedText>
              ) : null}
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.greyHover,
    backgroundColor: Colors.greyLow,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});

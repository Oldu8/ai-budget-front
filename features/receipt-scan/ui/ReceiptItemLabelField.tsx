import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

interface ReceiptItemLabelFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
}

export function ReceiptItemLabelField<T extends FieldValues>({
  control,
  name,
  disabled = false,
}: ReceiptItemLabelFieldProps<T>) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <View style={styles.wrap}>
          <ThemedText
            lightColor={Colors.grey}
            style={styles.label}
            numberOfLines={1}
          >
            {t('add.receiptScan.itemLabel')}
          </ThemedText>
          <TextInput
            value={typeof value === 'string' ? value : ''}
            onChangeText={onChange}
            editable={!disabled}
            placeholder={t('add.receiptScan.itemLabelPlaceholder')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            autoCapitalize="sentences"
            autoCorrect
          />
          {fieldState.error?.message ? (
            <ThemedText style={styles.error} lightColor={Colors.error}>
              {fieldState.error.message}
            </ThemedText>
          ) : null}
        </View>
      )}
    />
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

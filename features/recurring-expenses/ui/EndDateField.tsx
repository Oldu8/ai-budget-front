import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Switch, View } from 'react-native';

import { TransactionDateField } from '@/features/transactions/ui/TransactionDateField';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

interface EndDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  hasEndDateName: FieldPath<T>;
  endsAtName: FieldPath<T>;
  disabled?: boolean;
}

export function EndDateField<T extends FieldValues>({
  control,
  hasEndDateName,
  endsAtName,
  disabled = false,
}: EndDateFieldProps<T>) {
  const { t } = useTranslation();

  return (
    <View className="mt-4">
      <Controller
        control={control}
        name={hasEndDateName}
        render={({ field: { value: hasEnd, onChange: setHasEnd } }) => (
          <>
            <View className="flex-row justify-between items-center px-1 py-2">
              <ThemedText style={{ fontSize: 16, flex: 1, paddingRight: 12 }}>
                {t('recurring.endDate.toggle')}
              </ThemedText>
              <Switch
                value={Boolean(hasEnd)}
                onValueChange={setHasEnd}
                disabled={disabled}
                trackColor={{ false: Colors.greyHover, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
            {hasEnd ? (
              <TransactionDateField
                control={control}
                name={endsAtName}
                disabled={disabled}
                maximumDate={null}
                datePrefixI18nKey="recurring.endDate.prefix"
              />
            ) : (
              <ThemedText
                className="px-1 mt-1 text-sm"
                lightColor={Colors.grey}
              >
                {t('recurring.endDate.placeholder')}
              </ThemedText>
            )}
          </>
        )}
      />
    </View>
  );
}

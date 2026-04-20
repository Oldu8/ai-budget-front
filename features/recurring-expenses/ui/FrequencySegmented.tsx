import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import type { RecurringFrequency } from '@/features/recurring-expenses/types';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

const FREQUENCIES: RecurringFrequency[] = ['weekly', 'monthly', 'yearly'];

interface FrequencySegmentedProps {
  value: RecurringFrequency;
  onChange: (v: RecurringFrequency) => void;
  disabled?: boolean;
}

export function FrequencySegmented({
  value,
  onChange,
  disabled = false,
}: FrequencySegmentedProps) {
  const { t } = useTranslation();

  return (
    <View className="mt-6">
      <ThemedText className="mb-3 text-xs font-medium tracking-wider uppercase text-brand-grey">
        {t('recurring.frequencyLabel')}
      </ThemedText>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {FREQUENCIES.map((freq) => {
          const isSelected = value === freq;
          return (
            <Pressable
              key={freq}
              onPress={() => !disabled && onChange(freq)}
              disabled={disabled}
              style={{
                backgroundColor: isSelected ? Colors.primary : Colors.greyLow,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 999,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isSelected ? Colors.white : Colors.black,
                }}
              >
                {t(`recurring.frequency.${freq}`)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

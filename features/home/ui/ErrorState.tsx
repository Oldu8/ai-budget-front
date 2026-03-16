import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/shared/ui/ThemedText';
import { Button } from '@/shared/ui/Button';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <ThemedText type="subtitle" className="text-center text-brand-black">
        {t('home.errorTitle')}
      </ThemedText>
      <Button variant="secondary" onPress={onRetry} className="mt-4">
        {t('home.errorRetry')}
      </Button>
    </View>
  );
}

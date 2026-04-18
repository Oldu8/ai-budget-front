import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/shared/ui/BackButton';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export function ScanReviewEmptyState() {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <BackButton />
      <ScreenContainer variant="default" edges={['bottom']}>
        <View className="flex-1 justify-center px-6">
          <ThemedText type="title" className="text-center text-brand-primary">
            {t('add.receiptScan.review.emptyDraftTitle')}
          </ThemedText>
          <ThemedText className="mt-3 text-base text-center text-brand-grey">
            {t('add.receiptScan.review.emptyDraftMessage')}
          </ThemedText>
          <View className="mt-8">
            <Button
              variant="primary"
              onPress={() => router.replace('/(tabs)/add' as never)}
            >
              {t('add.receiptScan.review.emptyDraftCta')}
            </Button>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

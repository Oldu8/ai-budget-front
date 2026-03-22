import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/shared/constants/theme';
import { BackButton } from '@/shared/ui/BackButton';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function PaymentPlanScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <BackButton />
      <ScreenContainer variant="default">
        <View style={styles.content}>
          <ThemedText style={styles.description}>
            {t('profile.paymentPlanDescription', 'Manage your payment methods and subscription plan. Coming soon.')}
          </ThemedText>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
  },
});

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { PreferencesForm } from '@/features/funnel/ui/PreferencesForm';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function VisibilityQuestionsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer variant="default">
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          {t('onboarding.preferences.title')}
        </ThemedText>
        <ThemedText style={styles.description}>
          {t('onboarding.preferences.description')}
        </ThemedText>

        <PreferencesForm
          submitLabel={t('onboarding.preferences.continue')}
          showSkip
          skipLabel={t('onboarding.preferences.skip')}
          onSuccess={() => router.replace('/(tabs)')}
          onSkip={() => router.replace('/(tabs)')}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  title: {
    marginTop: 40,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
    marginBottom: 24,
  },
});

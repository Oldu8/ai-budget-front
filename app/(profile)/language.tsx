import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { updateSettingsApi } from '@/features/settings/api/updateSettings';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useUserStore } from '@/features/auth/model/useUserStore';
import { LANGUAGE_ITEMS } from '@/shared/constants/languages';
import { Colors } from '@/shared/constants/theme';
import { setLanguage } from '@/shared/i18n';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';
import { SearchableSelect } from '@/shared/ui/SearchableSelect';

export default function LanguageScreen() {
  const { t } = useTranslation();
  const { settings } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentValue = settings?.language ?? '';

  const handleChange = async (value: string) => {
    setError(null);
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const updated = await updateSettingsApi.update({
        currency: settings?.currency,
        language: value,
        timezone: settings?.timezone,
      });
      useUserStore.getState().setUserData({
        user: useUserStore.getState().user,
        settings: updated,
      });
      setLanguage(value as 'en' | 'uk' | 'es');
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update language');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer variant="default">
      <View style={styles.content}>
        <ThemedText style={styles.label}>{t('profile.language')}</ThemedText>
        <SearchableSelect
          items={LANGUAGE_ITEMS}
          value={currentValue || null}
          placeholder={t('profile.selectLanguage', 'Select language')}
          onChange={handleChange}
        />
        {error ? (
          <ThemedText style={styles.error}>{error}</ThemedText>
        ) : null}
        {isSaving ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grey,
    marginBottom: 8,
  },
  error: {
    fontSize: 13,
    color: Colors.error,
    marginTop: 12,
  },
  loader: {
    marginTop: 16,
    alignItems: 'center',
  },
});

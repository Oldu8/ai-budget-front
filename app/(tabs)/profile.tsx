import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import {
  ProfileHeader,
  SettingsRow,
  SettingsSection,
} from '@/features/settings';
import {
  getCurrencyDisplayValue,
  getLanguageDisplayValue,
  getTimezoneDisplayValue,
} from '@/features/settings/lib/getSettingDisplayValue';
import { Colors } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, settings, signOut } = useAuthContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLogoutError(null);
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      setLogoutError(t('profile.logoutError', 'Something went wrong. Please try again.'));
    } finally {
      setIsSigningOut(false);
    }
  };

  const version =
    Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

  return (
    <ScreenContainer variant="default">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ProfileHeader user={user} />

        <SettingsSection>
          <SettingsRow
            icon="person"
            title={t('profile.editProfile')}
            onPress={() => router.push('/(profile)/edit-profile')}
          />
          <SettingsRow
            icon="credit-card"
            title={t('profile.paymentAndPlan')}
            onPress={() => router.push('/(profile)/payment-plan')}
          />
          <SettingsRow
            icon="attach-money"
            title={t('profile.currency')}
            value={getCurrencyDisplayValue(settings?.currency)}
            onPress={() => router.push('/(profile)/currency')}
          />
          <SettingsRow
            icon="language"
            title={t('profile.language')}
            value={getLanguageDisplayValue(settings?.language)}
            onPress={() => router.push('/(profile)/language')}
          />
          <SettingsRow
            icon="schedule"
            title={t('profile.timezone')}
            value={getTimezoneDisplayValue(settings?.timezone)}
            onPress={() => router.push('/(profile)/timezone')}
          />
          <SettingsRow
            icon="visibility"
            title={t('profile.visibilityPreferences')}
            onPress={() => router.push('/(profile)/visibility-preferences')}
          />
          <SettingsRow
            icon="file-download"
            title={t('profile.exportData')}
            onPress={() => router.push('/(profile)/export-data')}
          />
        </SettingsSection>

        <SettingsSection>
          <SettingsRow
            icon="notifications"
            title={t('profile.notifications')}
            onPress={() => router.push('/(profile)/notifications')}
          />
        </SettingsSection>

        <View style={styles.logoutSection}>
          <Button
            variant="secondary"
            onPress={handleSignOut}
            loading={isSigningOut}
          >
            {t('profile.logout')}
          </Button>
          {logoutError ? (
            <ThemedText style={styles.logoutError}>{logoutError}</ThemedText>
          ) : null}
        </View>

        <ThemedText style={styles.version}>
          {t('profile.version', { version })}
        </ThemedText>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  logoutError: {
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
  },
  version: {
    fontSize: 13,
    color: Colors.grey,
    textAlign: 'center',
  },
});

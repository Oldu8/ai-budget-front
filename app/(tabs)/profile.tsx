import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { usePaidFeatureGate } from '@/features/billing';
import {
  ProfileHeader,
  SettingsPickerRow,
  SettingsRow,
  SettingsSection,
} from '@/features/settings';
import { updateSettingsApi } from '@/features/settings/api/updateSettings';
import {
  getCurrencyDisplayValue,
  getLanguageDisplayValue,
  getTimezoneDisplayValue,
} from '@/features/settings/lib/getSettingDisplayValue';
import { SubscriptionProfileBlock } from '@/features/subscription';
import { CURRENCY_ITEMS } from '@/shared/constants/currencies';
import { LANGUAGE_ITEMS } from '@/shared/constants/languages';
import { Colors } from '@/shared/constants/theme';
import { TIMEZONE_ITEMS } from '@/shared/constants/timezones';
import type { SupportedLanguage } from '@/shared/i18n';
import { setLanguage } from '@/shared/i18n';
import { Button } from '@/shared/ui/Button';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const {
    user,
    settings,
    subscription,
    subscriptionStatus,
    scanUsage,
    signOut,
    refetchMe,
  } = useAuthContext();
  const { requestAccess } = usePaidFeatureGate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [currencyError, setCurrencyError] = useState<string | null>(null);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [timezoneError, setTimezoneError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetchMe();
    }, [refetchMe])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchMe();
    } finally {
      setRefreshing(false);
    }
  }, [refetchMe]);

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

  const handleCurrencyChange = useCallback(
    async (value: string) => {
      setCurrencyError(null);
      try {
        const updated = await updateSettingsApi.update({
          currency: value,
          language: settings?.language,
          timezone: settings?.timezone,
        });
        useUserStore.getState().setUserData({
          user: useUserStore.getState().user,
          settings: updated,
        });
      } catch (err) {
        setCurrencyError(err instanceof Error ? err.message : 'Failed to update currency');
        throw err;
      }
    },
    [settings?.language, settings?.timezone]
  );

  const handleLanguageChange = useCallback(
    async (value: string) => {
      setLanguageError(null);
      try {
        const updated = await updateSettingsApi.update({
          currency: settings?.currency,
          language: value,
          timezone: settings?.timezone,
        });
        useUserStore.getState().setUserData({
          user: useUserStore.getState().user,
          settings: updated,
        });
        setLanguage(value as SupportedLanguage);
      } catch (err) {
        setLanguageError(err instanceof Error ? err.message : 'Failed to update language');
        throw err;
      }
    },
    [settings?.currency, settings?.timezone]
  );

  const handleTimezoneChange = useCallback(
    async (value: string) => {
      setTimezoneError(null);
      try {
        const updated = await updateSettingsApi.update({
          currency: settings?.currency,
          language: settings?.language,
          timezone: value,
        });
        useUserStore.getState().setUserData({
          user: useUserStore.getState().user,
          settings: updated,
        });
      } catch (err) {
        setTimezoneError(err instanceof Error ? err.message : 'Failed to update timezone');
        throw err;
      }
    },
    [settings?.currency, settings?.language]
  );

  const version =
    Constants.expoConfig?.version ?? Constants.manifest?.version ?? '1.0.0';

  return (
    <ScreenContainer variant="default" edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <ProfileHeader user={user} />

        <View style={styles.subscriptionSection}>
          <ThemedText style={styles.subscriptionSectionTitle}>
            {t('subscription.sectionTitle')}
          </ThemedText>
          <SubscriptionProfileBlock
            subscription={subscription}
            subscriptionStatus={subscriptionStatus}
            scanUsage={scanUsage}
            onManageBilling={() => {
              router.push('/(profile)/payment-plan');
            }}
          />
        </View>

        <SettingsSection title={t('profile.sectionAccount')}>
          <SettingsRow
            icon="person"
            title={t('profile.editProfile')}
            subtitle={t('profile.editProfileSubtitle')}
            onPress={() => router.push('/(profile)/edit-profile')}
          />
        </SettingsSection>

        <SettingsSection title={t('profile.sectionPreferences')}>
          <SettingsPickerRow
            icon="attach-money"
            title={t('profile.currency')}
            subtitle={t('profile.currencySubtitle')}
            items={CURRENCY_ITEMS}
            value={settings?.currency ?? null}
            onChange={handleCurrencyChange}
            getDisplayValue={getCurrencyDisplayValue}
            placeholder={t('profile.selectCurrency', 'Select currency')}
            error={currencyError}
          />
          <SettingsPickerRow
            icon="language"
            title={t('profile.language')}
            subtitle={t('profile.languageSubtitle')}
            items={LANGUAGE_ITEMS}
            value={settings?.language ?? null}
            onChange={handleLanguageChange}
            getDisplayValue={getLanguageDisplayValue}
            placeholder={t('profile.selectLanguage', 'Select language')}
            error={languageError}
          />
          <SettingsPickerRow
            icon="schedule"
            title={t('profile.timezone')}
            subtitle={t('profile.timezoneSubtitle')}
            items={TIMEZONE_ITEMS}
            value={settings?.timezone ?? null}
            onChange={handleTimezoneChange}
            getDisplayValue={getTimezoneDisplayValue}
            placeholder={t('profile.selectTimezone', 'Select timezone')}
            error={timezoneError}
          />
        </SettingsSection>

        <SettingsSection title={t('profile.sectionPersonalization')}>
          <SettingsRow
            icon="visibility"
            title={t('profile.visibilityPreferences')}
            subtitle={t('profile.visibilityPreferencesSubtitle')}
            onPress={() => router.push('/(profile)/visibility-preferences')}
          />
        </SettingsSection>

        <SettingsSection title={t('profile.sectionData')}>
          <SettingsRow
            icon="file-download"
            title={t('profile.exportData')}
            subtitle={t('profile.exportDataSubtitle')}
            onPress={() =>
              requestAccess(
                'csvExport',
                () => router.push('/(profile)/export-data'),
                {
                  title: t('billing.csvUpgradeTitle', 'Upgrade to export CSV'),
                  reasonText: t(
                    'billing.csvUpgradeSubtitle',
                    'CSV export is available on Basic, Plus, and Premium plans.'
                  ),
                }
              )
            }
          />
        </SettingsSection>

        <SettingsSection title={t('profile.sectionNotifications')}>
          <SettingsRow
            icon="notifications"
            title={t('profile.notifications')}
            onPress={() => router.push('/(profile)/notifications')}
          />
        </SettingsSection>

        <View style={styles.logoutSection}>
          <Button
            variant="destructive"
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
    paddingBottom: 8,
  },
  subscriptionSection: {
    marginBottom: 20,
  },
  subscriptionSectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grey,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logoutSection: {
    margin: 0,
    paddingVertical: 16,
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

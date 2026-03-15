import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ProfileLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: t('profile.editProfile') }} />
      <Stack.Screen name="payment-plan" options={{ title: t('profile.paymentAndPlan') }} />
      <Stack.Screen name="currency" options={{ title: t('profile.currency') }} />
      <Stack.Screen name="language" options={{ title: t('profile.language') }} />
      <Stack.Screen name="timezone" options={{ title: t('profile.timezone') }} />
      <Stack.Screen
        name="visibility-preferences"
        options={{ title: t('profile.visibilityPreferences') }}
      />
      <Stack.Screen name="export-data" options={{ title: t('profile.exportData') }} />
      <Stack.Screen name="notifications" options={{ title: t('profile.notifications') }} />
    </Stack>
  );
}

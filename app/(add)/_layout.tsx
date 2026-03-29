import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/shared/constants/theme';

export default function AddLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.headerText,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="manual"
        options={{
          title: t('add.manual.addExpense'),
        }}
      />
      <Stack.Screen
        name="scan-review"
        options={{
          title: t('add.receiptScan.reviewPlaceholderTitle'),
        }}
      />
    </Stack>
  );
}
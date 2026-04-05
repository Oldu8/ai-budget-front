import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/shared/constants/theme';

export default function HistoryStackLayout() {
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
        /**
         * iOS / web: back control shows only the chevron, not the previous screen title.
         * @see https://reactnavigation.org/docs/native-stack-navigator#headerbackbuttondisplaymode
         */
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('history.title'),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: t('history.title'),
        }}
      />
      <Stack.Screen
        name="line-item"
        options={{
          title: t('add.receiptScan.reviewEditItemTitle'),
        }}
      />
    </Stack>
  );
}
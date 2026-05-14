import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { Platform, Pressable, StyleSheet } from 'react-native';

export default function AddLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: styles.header,
        /** Title color; keep separate from headerTintColor so the back control can differ. */
        headerTintColor: Colors.headerText,
        headerTitleStyle: [styles.headerTitle, styles.headerTitleColor],
        /**
         * Nested stack often has only this screen — no native back. router.back() pops
         * to the tab. HeaderBackButton ignores tintColor here (chevron stays system blue);
         * use IconSymbol with explicit color instead.
         */
        headerLeft: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.headerBack}
          >
            <IconSymbol name="chevron.left" size={22} color={Colors.black} />
          </Pressable>
        ),
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="manual"
        options={{
          title: t('add.manual.addExpense'),
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="scan-review"
        options={{
          title: t('add.receiptScan.reviewTitle'),
        }}
      />
      <Stack.Screen
        name="scan-review-item"
        options={{
          title: t('add.receiptScan.reviewEditItemTitle'),
        }}
      />
      <Stack.Screen
        name="scan-success"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="voice"
        options={{
          title: t('add.voiceExpense.screenTitle'),
        }}
      />
    </Stack>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitleColor: {
    color: Colors.headerText,
  },
  headerBack: {
    marginLeft: Platform.OS === 'ios' ? 8 : 4,
    paddingRight: 8,
    justifyContent: 'center',
  },
});
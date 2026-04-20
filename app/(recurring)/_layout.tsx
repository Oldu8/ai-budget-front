import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';

export default function RecurringLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: styles.header,
        headerTintColor: Colors.headerText,
        headerTitleStyle: [styles.headerTitle, styles.headerTitleColor],
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
        name="index"
        options={{ title: t('recurring.title') }}
      />
      <Stack.Screen
        name="new"
        options={{ title: t('recurring.newTitle') }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: t('recurring.editTitle') }}
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

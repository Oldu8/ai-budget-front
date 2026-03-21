import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors } from '@/shared/constants/theme';

export default function AddLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: styles.header,
        headerTintColor: Colors.headerText,
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={Colors.headerText} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="manual" options={{ title: t('add.manual.addExpense') }} />
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
  closeButton: {
    padding: 8,
    marginLeft: 4,
  },
});

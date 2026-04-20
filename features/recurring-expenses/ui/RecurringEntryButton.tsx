import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { usePaidFeatureGate } from '@/features/billing';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

interface RecurringEntryButtonProps {
  onGrantedNavigate: () => void;
}

export function RecurringEntryButton({
  onGrantedNavigate,
}: RecurringEntryButtonProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { status } = useAuthContext();
  const { requestAccess } = usePaidFeatureGate();

  const onPress = useCallback(() => {
    if (status !== 'authenticated') {
      router.replace('/(auth)/login' as never);
      return;
    }
    requestAccess(
      'recurringExpenses',
      onGrantedNavigate,
      {
        title: t('recurring.paywall.title'),
        reasonText: t('recurring.paywall.reason'),
      }
    );
  }, [onGrantedNavigate, requestAccess, router, status, t]);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('recurring.entryTitle')}
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {t('recurring.entryTitle')}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t('recurring.entrySubtitle')}
          </ThemedText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Border + shadow on a plain View — iOS often skips these on Pressable alone. */
  card: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
        padding: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      },
    }),
  },
  pressable: {
    padding: 16,
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.92,
  },
  textBlock: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 18,
    textAlign: 'center',
  },
});

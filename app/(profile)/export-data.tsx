import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { planIncludesPaidFeature, useBillingActions } from '@/features/billing';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function ExportDataScreen() {
  const { t } = useTranslation();
  const { subscription } = useAuthContext();
  const { openPaywall } = useBillingActions();
  const planType = subscription?.plan?.type ?? PlanType.Free;
  const canExport = planIncludesPaidFeature(planType, 'csvExport');
  const didHandleGate = useRef(false);

  useEffect(() => {
    if (canExport || didHandleGate.current) return;
    didHandleGate.current = true;
    openPaywall({
      title: t('billing.csvUpgradeTitle', 'Upgrade to export CSV'),
      reasonText: t(
        'billing.csvUpgradeSubtitle',
        'CSV export is available on Basic, Plus, and Premium plans.'
      ),
    });
    router.back();
  }, [canExport, openPaywall, t]);

  if (!canExport) {
    return (
      <ScreenContainer variant="default">
        <View style={styles.guard}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer variant="default">
      <View style={styles.content}>
        <ThemedText style={styles.description}>
          {t('profile.exportDataDescription', 'Export your budget data as CSV. Coming soon.')}
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  guard: {
    flex: 1,
    paddingTop: 48,
    alignItems: 'center',
  },
  content: {
    paddingTop: 24,
    gap: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
  },
});

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useBillingActions } from '@/features/billing/model/useBillingActions';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { usePlansQuery } from '@/features/billing/model/usePlansQuery';
import { PlanCard } from '@/features/billing/ui/PlanCard';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

export function PaywallSheet() {
  const { t } = useTranslation();
  /** Separate selectors — object selector would return a new ref every time and loop updates. */
  const isOpen = usePaywallStore((s) => s.isOpen);
  const contextTitle = usePaywallStore((s) => s.contextTitle);
  const contextMessage = usePaywallStore((s) => s.contextMessage);
  const close = usePaywallStore((s) => s.close);
  const { subscription } = useAuthContext();
  const currentPlanType = subscription?.plan?.type ?? PlanType.Free;

  const { data: plans, isLoading, isError, refetch } = usePlansQuery();
  const { startCheckout, checkoutStatus } = useBillingActions();

  const headerTitle = useMemo(
    () =>
      contextTitle ||
      t('billing.upgradeTitle', 'Unlock premium features'),
    [contextTitle, t]
  );
  const headerMessage = useMemo(
    () =>
      contextMessage ||
      t(
        'billing.upgradeMessage',
        'Choose Basic, Plus, or Premium to keep everything running.'
      ),
    [contextMessage, t]
  );

  /** Paywall is for upgrades only — omit Free from the card list. */
  const paywallPlans = useMemo(
    () => plans?.filter((p) => p.type !== PlanType.Free) ?? [],
    [plans]
  );

  if (!isOpen) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {headerTitle}
          </ThemedText>
          <ThemedText style={styles.subtitle}>{headerMessage}</ThemedText>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.errorBlock}>
            <ThemedText style={styles.errorTitle}>
              {t('billing.loadPlansError', 'Could not load plans')}
            </ThemedText>
            <Pressable style={styles.retry} onPress={() => void refetch()}>
              <ThemedText style={styles.retryText}>
                {t('billing.retry', 'Retry')}
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {paywallPlans.map((plan) => (
              <PlanCard
                key={plan.type}
                plan={plan}
                isCurrent={plan.type === currentPlanType}
                onSelect={(p) => void startCheckout(p.type)}
                loading={checkoutStatus === 'pending'}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '10%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    gap: 6,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 14,
    paddingBottom: 32,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  errorBlock: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  errorTitle: {
    color: Colors.error,
    fontWeight: '600',
  },
  retry: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

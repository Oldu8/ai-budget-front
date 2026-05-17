import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useBillingActions, usePlansQuery } from '@/features/billing';
import { PlanCard } from '@/features/billing/ui/PlanCard';
import { UpgradePromoCard } from '@/features/billing/ui/UpgradePromoCard';
import { SubscriptionProfileBlock } from '@/features/subscription';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function PaymentPlanScreen() {
  const { t } = useTranslation();
  const { subscription, subscriptionStatus, scanUsage } = useAuthContext();
  const { data: plans, isLoading, isError, refetch } = usePlansQuery();
  const { startCheckout, openPortal, openPaywall, checkoutLoadingPlanType } =
    useBillingActions();

  const currentPlan = subscription?.plan?.type ?? PlanType.Free;
  const isPaid =
    subscription?.plan?.type &&
    subscription.plan.type !== PlanType.Free;

  const manageHandler = useMemo(
    () => (isPaid ? openPortal : () => openPaywall()),
    [isPaid, openPaywall, openPortal]
  );

  /** Catalog row for the user’s active plan — drives feature bullets (not always Free). */
  const currentCatalogPlan = useMemo(
    () =>
      plans?.find(
        (p) => String(p.type).toLowerCase() === String(currentPlan).toLowerCase()
      ),
    [plans, currentPlan]
  );
  const currentPlanFeatureLines = useMemo(() => {
    if (!currentCatalogPlan?.description?.trim()) return null;
    return currentCatalogPlan.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [currentCatalogPlan]);

  /** Paid-only upgrades: exclude Free and the plan already shown at the top. */
  const upgradePlans = useMemo(
    () =>
      plans?.filter(
        (p) =>
          p.type !== PlanType.Free &&
          String(p.type).toLowerCase() !== String(currentPlan).toLowerCase()
      ) ?? [],
    [plans, currentPlan]
  );

  return (
    <View style={styles.screen}>
      <ScreenContainer variant="default" edges={[]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ThemedText type="title" style={styles.title}>
            {t('billing.currentPlan', 'Plans')}
          </ThemedText>
          <SubscriptionProfileBlock
            subscription={subscription}
            subscriptionStatus={subscriptionStatus}
            scanUsage={scanUsage}
            onManageBilling={manageHandler}
            planFeatureLines={currentPlanFeatureLines ?? undefined}
          />

          <Section title={t('billing.plansTitle', 'Plans')}>
            {isLoading ? (
              <View style={styles.loader}>
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : isError ? (
              <View style={styles.errorBlock}>
                <ThemedText style={styles.errorTitle}>
                  {t('billing.loadPlansError', 'Could not load plans')}
                </ThemedText>
                <UpgradePromoCard
                  title={t('billing.refreshPlans', 'Refresh plans')}
                  subtitle={t('billing.refreshPlansHint', 'Please try again.')}
                  ctaLabel={t('billing.retry', 'Retry')}
                  onPress={() => void refetch()}
                />
              </View>
            ) : (
              upgradePlans.map((plan) => (
                <PlanCard
                  key={plan.type}
                  plan={plan}
                  isCurrent={plan.type === currentPlan}
                  onSelect={(p) => void startCheckout(p.type)}
                  loading={checkoutLoadingPlanType === plan.type}
                />
              ))
            )}
          </Section>

        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

function Section({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.section, style]}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 18,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.primary,
  },
  loader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorBlock: {
    gap: 8,
  },
  errorTitle: {
    color: Colors.error,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    paddingTop: 16,
    textAlign: 'center',
  },
});

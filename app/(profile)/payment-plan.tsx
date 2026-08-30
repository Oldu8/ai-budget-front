import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useBillingActions, useIosPrices, usePlansQuery } from '@/features/billing';
import { isRevenueCatPlatform } from '@/features/billing/lib/revenueCat';
import { getPlanFeatureLines } from '@/features/billing/lib/planMarketingCopy';
import { PlanCard } from '@/features/billing/ui/PlanCard';
import { SubscriptionTermsFooter } from '@/features/billing/ui/SubscriptionTermsFooter';
import { UpgradePromoCard } from '@/features/billing/ui/UpgradePromoCard';
import { SubscriptionProfileBlock } from '@/features/subscription';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';

export default function PaymentPlanScreen() {
  const { t } = useTranslation();
  const { subscription, subscriptionStatus, scanUsage, status } = useAuthContext();
  const { data: plans, isLoading, isError, refetch } = usePlansQuery();
  const { data: iosPrices } = useIosPrices(status === 'authenticated');
  const {
    startCheckout,
    openPortal,
    openPaywall,
    restorePurchases,
    isRestoring,
    checkoutLoadingPlanType,
    portalLoadingPlanType,
  } = useBillingActions();

  const currentPlan = subscription?.plan?.type ?? PlanType.Free;
  const isPaid =
    subscription?.plan?.type &&
    subscription.plan.type !== PlanType.Free;

  /** Wrap in a closure — passing openPortal straight to onPress would feed it the press event. */
  const manageHandler = useMemo(
    () => (isPaid ? () => void openPortal() : () => openPaywall()),
    [isPaid, openPaywall, openPortal]
  );

  const currentPlanFeatureLines = useMemo(
    () => getPlanFeatureLines(t, currentPlan),
    [t, currentPlan]
  );

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
            planFeatureLines={
              currentPlanFeatureLines.length > 0
                ? currentPlanFeatureLines
                : undefined
            }
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
                  priceOverride={iosPrices?.[plan.type as PlanType]}
                  onSelect={(p) =>
                    isPaid ? void openPortal(p.type) : void startCheckout(p.type)
                  }
                  loading={
                    checkoutLoadingPlanType === plan.type ||
                    portalLoadingPlanType === plan.type
                  }
                  selectLabel={
                    isPaid ? t('billing.changePlan', 'Change plan') : undefined
                  }
                />
              ))
            )}
          </Section>

          {isRevenueCatPlatform() ? (
            <>
              <SubscriptionTermsFooter />
              <Pressable
                style={styles.restoreButton}
                onPress={() => void restorePurchases()}
                disabled={isRestoring}
                accessibilityRole="button"
              >
                {isRestoring ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <ThemedText style={styles.restoreButtonText}>
                    {t('billing.restorePurchases', 'Restore Purchases')}
                  </ThemedText>
                )}
              </Pressable>
            </>
          ) : null}
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
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});

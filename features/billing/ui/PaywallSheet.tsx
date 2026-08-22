import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { isRevenueCatPlatform } from '@/features/billing/lib/revenueCat';
import { useBillingActions } from '@/features/billing/model/useBillingActions';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { useIosPrices } from '@/features/billing/model/useIosPrices';
import { usePlansQuery } from '@/features/billing/model/usePlansQuery';
import { PlanCard } from '@/features/billing/ui/PlanCard';
import { SubscriptionTermsFooter } from '@/features/billing/ui/SubscriptionTermsFooter';
import { Analytics } from '@/shared/analytics';
import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function PaywallSheet() {
  const { t } = useTranslation();
  /** Separate selectors — object selector would return a new ref every time and loop updates. */
  const isOpen = usePaywallStore((s) => s.isOpen);
  const contextTitle = usePaywallStore((s) => s.contextTitle);
  const contextMessage = usePaywallStore((s) => s.contextMessage);
  const close = usePaywallStore((s) => s.close);
  const [isMounted, setIsMounted] = useState(false);
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const { subscription } = useAuthContext();
  const currentPlanType = subscription?.plan?.type ?? PlanType.Free;

  const { data: plans, isLoading, isError, refetch } = usePlansQuery();
  const { data: iosPrices } = useIosPrices();
  const {
    startCheckout,
    checkoutLoadingPlanType,
    openPortal,
    portalLoadingPlanType,
  } = useBillingActions();

  /** User is already a paying customer — plan changes go through the portal, not a new checkout. */
  const hasActivePaidPlan = currentPlanType !== PlanType.Free;

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

  /** Fire view_paywall once each time the sheet opens; source = what gated it. */
  useEffect(() => {
    if (isOpen) {
      Analytics.logViewPaywall(contextTitle ?? undefined);
    }
  }, [isOpen, contextTitle]);

  /** Drive backdrop fade and sheet slide separately — RN's Modal animationType="slide"
   * transforms the whole native container (backdrop included), which on iOS reads as
   * the dark overlay rising up from the bottom instead of a clean fade-in. */
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      backdropOpacity.value = withTiming(1, { duration: 220 });
      sheetTranslateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
    } else if (isMounted) {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 240, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setIsMounted)(false);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  if (!isMounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={close}>
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={close} />
      </Animated.View>
      <Animated.View style={[styles.sheet, sheetAnimatedStyle]}>
        <Pressable
          onPress={close}
          hitSlop={12}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel={t('buttons.close')}
        >
          <MaterialIcons name="close" size={26} color={Colors.grey} />
        </Pressable>
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
                priceOverride={iosPrices?.[plan.type as PlanType]}
                onSelect={() =>
                  hasActivePaidPlan
                    ? void openPortal(plan.type)
                    : void startCheckout(plan.type)
                }
                loading={
                  checkoutLoadingPlanType === plan.type ||
                  portalLoadingPlanType === plan.type
                }
                selectLabel={
                  hasActivePaidPlan
                    ? t('billing.changePlan', 'Change plan')
                    : undefined
                }
              />
            ))}
            {isRevenueCatPlatform() ? <SubscriptionTermsFooter /> : null}
          </ScrollView>
        )}
      </Animated.View>
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
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  header: {
    gap: 6,
    marginBottom: 12,
    paddingRight: 36,
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

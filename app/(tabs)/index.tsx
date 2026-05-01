import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { usePaywallStore } from '@/features/billing/model/usePaywallStore';
import { UpgradePromoCard } from '@/features/billing/ui/UpgradePromoCard';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';
import { EmptyExpensesState } from '@/features/home/ui/EmptyExpensesState';
import { ErrorState } from '@/features/home/ui/ErrorState';
import { ExpenseMonthTable } from '@/features/home/ui/ExpenseMonthTable';
import { ExpenseTableToolbar } from '@/features/home/ui/ExpenseTableToolbar';
import { HomeScreenSkeleton } from '@/features/home/ui/HomeScreenSkeleton';
import { MonthSwitcher } from '@/features/home/ui/MonthSwitcher';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isLoading, isError, refetch, isEmpty, hasNoExpenses } =
    useMonthlyExpenseTable();
  const { refetchMe, subscription } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const openPaywall = usePaywallStore((s) => s.open);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      await refetchMe();
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refetchMe]);

  const showEmpty = !isLoading && !isError && (isEmpty || hasNoExpenses);

  const planType = subscription?.plan?.type;
  const showUpgradeCta =
    planType == null || planType === PlanType.Free;

  return (
    <ScreenContainer
      variant="fullWidth"
      edges={[]}
      style={{ backgroundColor: Colors.greyLow }}
    >
      <MonthSwitcher />
      {isLoading && <HomeScreenSkeleton />}
      {isError && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ErrorState onRetry={() => void refetch()} />
        </ScrollView>
      )}
      {showEmpty && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <EmptyExpensesState />
        </ScrollView>
      )}
      {!isLoading && !isError && !showEmpty && (
        <View style={{ flex: 1 }}>
          <ExpenseTableToolbar
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          <ExpenseMonthTable refreshing={refreshing} />
          {showUpgradeCta ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              <UpgradePromoCard
                title={t('home.upgradeTitle')}
                subtitle={t('home.upgradeSubtitle')}
                ctaLabel={t('home.upgradeCta')}
                onPress={() => openPaywall()}
              />
            </View>
          ) : null}
        </View>
      )}
    </ScreenContainer>
  );
}

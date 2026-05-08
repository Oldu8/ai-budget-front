import { AnalyticsDashboard } from '@/features/analytics/ui/AnalyticsDashboard';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { usePaidFeatureGate } from '@/features/billing';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';
import { useSelectedMonth } from '@/features/home/model/useSelectedMonth';
import { EmptyExpensesState } from '@/features/home/ui/EmptyExpensesState';
import { ErrorState } from '@/features/home/ui/ErrorState';
import { ExpenseMonthTable } from '@/features/home/ui/ExpenseMonthTable';
import { ExpenseTableToolbar } from '@/features/home/ui/ExpenseTableToolbar';
import {
  HomeViewModeSwitcher,
  type HomeViewMode,
} from '@/features/home/ui/HomeViewModeSwitcher';
import { HomeScreenSkeleton } from '@/features/home/ui/HomeScreenSkeleton';
import { MonthSwitcher } from '@/features/home/ui/MonthSwitcher';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { format } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { requestAccess } = usePaidFeatureGate();
  const { selectedDate } = useSelectedMonth();
  const monthKey = format(selectedDate, 'yyyy-MM');
  const [viewMode, setViewMode] = useState<HomeViewMode>('table');

  const { isLoading, isError, refetch, isEmpty, hasNoExpenses } =
    useMonthlyExpenseTable();
  const { refetchMe } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);

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

  const onSelectAnalytics = useCallback(() => {
    requestAccess(
      'analyticsDashboard',
      () => setViewMode('analytics'),
      {
        title: t('billing.analyticsUpgradeTitle'),
        reasonText: t('billing.analyticsUpgradeSubtitle'),
      }
    );
  }, [requestAccess, t]);

  return (
    <ScreenContainer
      variant="fullWidth"
      edges={[]}
      style={{ backgroundColor: Colors.greyLow }}
    >
      <MonthSwitcher />
      <HomeViewModeSwitcher
        viewMode={viewMode}
        onSelectTable={() => setViewMode('table')}
        onSelectAnalytics={onSelectAnalytics}
      />
      {viewMode === 'analytics' ? (
        <View style={{ flex: 1 }}>
          <AnalyticsDashboard month={monthKey} />
        </View>
      ) : (
        <>
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
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

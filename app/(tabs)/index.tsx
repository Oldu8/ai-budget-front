import React, { useCallback, useState } from 'react';
import { Platform, RefreshControl, ScrollView } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';
import { EmptyExpensesState } from '@/features/home/ui/EmptyExpensesState';
import { ErrorState } from '@/features/home/ui/ErrorState';
import { ExpenseMonthTable } from '@/features/home/ui/ExpenseMonthTable';
import { HomeScreenSkeleton } from '@/features/home/ui/HomeScreenSkeleton';
import { MonthSwitcher } from '@/features/home/ui/MonthSwitcher';
import { Colors } from '@/shared/constants/theme';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';

export default function HomeScreen() {
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

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={Colors.primaryHover}
      colors={[Colors.primaryHover]}
      progressBackgroundColor={Colors.white}
      progressViewOffset={Platform.OS === 'android' ? 12 : undefined}
    />
  );

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
          refreshControl={refreshControl}
        >
          <ErrorState onRetry={() => void refetch()} />
        </ScrollView>
      )}
      {showEmpty && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={refreshControl}
        >
          <EmptyExpensesState />
        </ScrollView>
      )}
      {!isLoading && !isError && !showEmpty && (
        <ExpenseMonthTable refreshing={refreshing} onRefresh={onRefresh} />
      )}
    </ScreenContainer>
  );
}

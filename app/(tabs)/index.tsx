import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useAuthContext } from '@/features/auth/providers/AuthProvider';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';
import { EmptyExpensesState } from '@/features/home/ui/EmptyExpensesState';
import { ErrorState } from '@/features/home/ui/ErrorState';
import { ExpenseMonthTable } from '@/features/home/ui/ExpenseMonthTable';
import { ExpenseTableToolbar } from '@/features/home/ui/ExpenseTableToolbar';
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
        </View>
      )}
    </ScreenContainer>
  );
}

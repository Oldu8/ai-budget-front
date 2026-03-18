import React from 'react';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { Colors } from '@/shared/constants/theme';
import { MonthSwitcher } from '@/features/home/ui/MonthSwitcher';
import { ExpenseMonthTable } from '@/features/home/ui/ExpenseMonthTable';
import { EmptyExpensesState } from '@/features/home/ui/EmptyExpensesState';
import { ErrorState } from '@/features/home/ui/ErrorState';
import { HomeScreenSkeleton } from '@/features/home/ui/HomeScreenSkeleton';
import { useMonthlyExpenseTable } from '@/features/home/model/useMonthlyExpenseTable';

export default function HomeScreen() {
  const { isLoading, isError, refetch, isEmpty, hasNoExpenses } =
    useMonthlyExpenseTable();

  const showEmpty = !isLoading && !isError && (isEmpty || hasNoExpenses);

  return (
    <ScreenContainer
      variant="fullWidth"
      edges={[]}
      style={{ backgroundColor: Colors.greyLow }}
    >
      <MonthSwitcher />
      {isLoading && <HomeScreenSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {showEmpty && <EmptyExpensesState />}
      {!isLoading && !isError && !showEmpty && <ExpenseMonthTable />}
    </ScreenContainer>
  );
}

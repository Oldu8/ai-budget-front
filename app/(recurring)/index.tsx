import { router } from 'expo-router';
import React from 'react';

import { useRecurringExpensesQuery } from '@/features/recurring-expenses/model/useRecurringExpensesQuery';
import { RecurringExpenseList } from '@/features/recurring-expenses/ui/RecurringExpenseList';
import { useCategoriesQuery } from '@/features/transactions/model/useCategoriesQuery';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';

export default function RecurringExpensesListScreen() {
  const listQuery = useRecurringExpensesQuery();
  const categoriesQuery = useCategoriesQuery();

  return (
    <ScreenContainer variant="default" edges={['bottom']}>
      <RecurringExpenseList
        data={listQuery.data ?? []}
        categories={categoriesQuery.data ?? []}
        isLoading={listQuery.isPending}
        isError={listQuery.isError}
        onRetry={() => void listQuery.refetch()}
        onRefresh={() => void listQuery.refetch()}
        isRefetching={listQuery.isRefetching}
        onCreatePress={() => router.push('/(recurring)/new' as never)}
        onItemPress={(id) => router.push(`/(recurring)/${id}` as never)}
      />
    </ScreenContainer>
  );
}

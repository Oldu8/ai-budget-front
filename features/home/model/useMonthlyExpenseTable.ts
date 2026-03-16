import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { buildExpenseTable } from '@/features/home/lib/buildExpenseTable';
import { useSelectedMonth } from '@/features/home/model/useSelectedMonth';
import { useHomeStore } from '@/features/home/model/homeStore';
import { useCategoriesQuery } from '@/features/home/model/useCategoriesQuery';
import { useMonthlySummaryQuery } from '@/features/home/model/useMonthlySummaryQuery';
import { getSubcategorySummary } from '@/features/home/api/getSubcategorySummary';

export function useMonthlyExpenseTable() {
  const { year, month } = useSelectedMonth();
  const expandedIds = useHomeStore((s) => s.expandedIds);

  const categoriesQuery = useCategoriesQuery();
  const monthlySummaryQuery = useMonthlySummaryQuery(year, month);

  const date = new Date(year, month - 1);
  const from = format(startOfMonth(date), 'yyyy-MM-dd');
  const to = format(endOfMonth(date), 'yyyy-MM-dd');

  const parentIds = useMemo(
    () =>
      categoriesQuery.data?.filter(
        (c) => c.category_id == null && (c.children?.length ?? 0) > 0
      ).map((c) => c.id) ?? [],
    [categoriesQuery.data]
  );

  const subcategoryQueries = useQueries({
    queries: parentIds.map((categoryId) => ({
      queryKey: ['home', 'subcategory-summary', categoryId, from, to],
      queryFn: () => getSubcategorySummary(categoryId, from, to),
      enabled: expandedIds.has(categoryId),
    })),
  });

  const tableData = useMemo(() => {
    const categories = categoriesQuery.data ?? [];
    const monthlySummary = monthlySummaryQuery.data ?? null;

    const subcategorySummaries = new Map<number, Awaited<ReturnType<typeof getSubcategorySummary>>>();
    parentIds.forEach((id, i) => {
      const q = subcategoryQueries[i];
      if (q?.data) {
        subcategorySummaries.set(id, q.data);
      }
    });

    return buildExpenseTable(
      categories,
      monthlySummary,
      subcategorySummaries,
      expandedIds,
      year,
      month
    );
  }, [
    categoriesQuery.data,
    monthlySummaryQuery.data,
    subcategoryQueries,
    parentIds,
    expandedIds,
    year,
    month,
  ]);

  const isLoading =
    categoriesQuery.isLoading || monthlySummaryQuery.isLoading;
  const isError = categoriesQuery.isError || monthlySummaryQuery.isError;
  const refetch = () => {
    categoriesQuery.refetch();
    monthlySummaryQuery.refetch();
  };
  const isEmpty =
    !isLoading &&
    !isError &&
    tableData.rows.length === 0;
  const hasNoExpenses =
    !isLoading &&
    !isError &&
    tableData.rows.length > 0 &&
    tableData.grandTotal === 0 &&
    !tableData.rows.some((r) => Object.keys(r.amountsByDay).length > 0);

  return {
    tableData,
    isLoading,
    isError,
    refetch,
    isEmpty,
    hasNoExpenses,
  };
}

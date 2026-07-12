import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';

import { useUserStore } from '@/features/auth/model/useUserStore';
import { useSelectedMonth } from '@/features/home/model/useSelectedMonth';
import { MonthSwitcher } from '@/features/home/ui/MonthSwitcher';
import { groupTransactionsByDate } from '@/features/transactions/lib/groupTransactionsByDate';
import { useTransactionsListQuery } from '@/features/transactions/model/useTransactionsListQuery';
import { HistoryTransactionRow } from '@/features/transactions/ui/HistoryTransactionRow';
import { Colors } from '@/shared/constants/theme';
import { useDateFnsLocale } from '@/shared/lib/dateFnsLocale';
import { Button } from '@/shared/ui/Button';
import { PaginationBar } from '@/shared/ui/PaginationBar';
import { ScreenContainer } from '@/shared/ui/ScreenContainer';
import { ThemedText } from '@/shared/ui/ThemedText';
import { format, parseISO } from 'date-fns';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const dateLocale = useDateFnsLocale();
  const { year, month } = useSelectedMonth();
  const currency = useUserStore((s) => s.settings?.currency ?? 'USD');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [year, month]);

  const { data, isLoading, isError, refetch, isFetching } =
    useTransactionsListQuery(year, month, page);

  const sections = useMemo(() => {
    const rows = data?.data ?? [];
    return groupTransactionsByDate(rows, (dateKey) => {
      try {
        return format(parseISO(`${dateKey}T12:00:00`), 'EEEE, MMM d, yyyy', {
          locale: dateLocale,
        });
      } catch {
        return dateKey;
      }
    });
  }, [data?.data, dateLocale]);

  const meta = data?.meta;
  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;

  return (
    <ScreenContainer
      variant="fullWidth"
      edges={[]}
      style={{ backgroundColor: Colors.greyLow }}
    >
      <MonthSwitcher />
      {isLoading && !data ? (
        <View className="items-center py-16">
          <ActivityIndicator />
        </View>
      ) : null}
      {isError ? (
        <View className="px-4 py-8">
          <ThemedText className="text-center text-brand-grey">
            {t('history.errorTitle')}
          </ThemedText>
          <View className="mt-4">
            <Button variant="primary" onPress={() => refetch()}>
              {t('history.errorRetry')}
            </Button>
          </View>
        </View>
      ) : null}
      {!isLoading && !isError && sections.length === 0 ? (
        <View className="px-6 py-12">
          <ThemedText type="subtitle" className="text-center text-brand-primary">
            {t('history.emptyTitle')}
          </ThemedText>
          <ThemedText className="mt-2 text-center text-brand-grey">
            {t('history.emptyDescription')}
          </ThemedText>
        </View>
      ) : null}
      {!isError && sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <HistoryTransactionRow transaction={item} currency={currency} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText className="px-4 mt-4 mb-2 text-xs font-semibold tracking-wide uppercase text-brand-grey">
              {title}
            </ThemedText>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          onRefresh={() => refetch()}
          refreshing={isFetching && !isLoading}
        />
      ) : null}
      {!isError && meta ? (
        <PaginationBar
          currentPage={currentPage}
          totalPages={lastPage}
          busy={isFetching}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
          prevLabel={t('history.paginationPrev')}
          nextLabel={t('history.paginationNext')}
          pageStatusLabel={t('history.pageOf', {
            current: currentPage,
            total: lastPage,
          })}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

import { useAnalyticsDashboardQuery } from '@/features/analytics/model/useAnalyticsDashboardQuery';
import { AnalyticsOverviewCards } from '@/features/analytics/ui/AnalyticsOverviewCards';
import { CategoryBars } from '@/features/analytics/ui/CategoryBars';
import { TrendsList } from '@/features/analytics/ui/TrendsList';
import { useBillingActions } from '@/features/billing';
import { ApiError } from '@/shared/api/client';
import { Colors } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/Button';
import { ThemedText } from '@/shared/ui/ThemedText';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type AnalyticsDashboardProps = {
  month: string;
};

export function AnalyticsDashboard({ month }: AnalyticsDashboardProps) {
  const { t } = useTranslation();
  const { openPaywall } = useBillingActions();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAnalyticsDashboardQuery(month, true);

  const isRefreshing = Boolean(data && isFetching);

  const skipFocusRefetchOnce = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (skipFocusRefetchOnce.current) {
        skipFocusRefetchOnce.current = false;
        return;
      }
      void refetch();
    }, [refetch])
  );

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError && error instanceof ApiError && error.status === 403) {
    return (
      <View style={styles.padded}>
        <ThemedText type="subtitle" style={styles.centerTitle}>
          {t('billing.analyticsUpgradeTitle')}
        </ThemedText>
        <ThemedText style={styles.centerSub}>
          {t('billing.analyticsUpgradeSubtitle')}
        </ThemedText>
        <Button
          variant="primary"
          onPress={() =>
            openPaywall({
              title: t('billing.analyticsUpgradeTitle'),
              reasonText: t('billing.analyticsUpgradeSubtitle'),
            })
          }
          style={styles.upgradeButton}
        >
          {t('billing.viewPlans')}
        </Button>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.padded}>
        <ThemedText type="subtitle" style={styles.centerTitle}>
          {t('home.errorTitle')}
        </ThemedText>
        <Button variant="secondary" onPress={() => void refetch()}>
          {t('home.errorRetry')}
        </Button>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const isEmpty =
    data.overview.total_spent === 0 && data.categories.length === 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => void refetch()}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {isEmpty ? (
        <ThemedText style={styles.emptyText}>{t('analytics.noExpenses')}</ThemedText>
      ) : (
        <>
          <AnalyticsOverviewCards data={data} />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            {t('analytics.spendingByCategory')}
          </ThemedText>
          <CategoryBars categories={data.categories} currency={data.currency} />
          {data.trends.categories.length > 0 ? (
            <>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {t('analytics.trends')}
              </ThemedText>
              <TrendsList trends={data.trends.categories} currency={data.currency} />
            </>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  centered: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padded: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  centerTitle: {
    textAlign: 'center',
    color: Colors.primary,
  },
  centerSub: {
    textAlign: 'center',
    color: Colors.grey,
    lineHeight: 22,
  },
  upgradeButton: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  pageTitle: {
    color: Colors.primary,
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 8,
    color: Colors.black,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.grey,
    lineHeight: 22,
    paddingVertical: 16,
  },
});

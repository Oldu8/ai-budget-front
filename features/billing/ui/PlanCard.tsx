import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { PlanType } from '@/entities/user';
import type { PlanCopy } from '@/features/billing/lib/planMarketingCopy';
import { getPlanCopy } from '@/features/billing/lib/planMarketingCopy';
import type { BillingPlan } from '@/features/billing/types';
import { Colors } from '@/shared/constants/theme';
import { formatMinorAsCurrency } from '@/shared/lib/formatMinorAmount';
import { Button } from '@/shared/ui/Button';
import { ThemedText } from '@/shared/ui/ThemedText';

interface PlanCardProps {
  plan: BillingPlan;
  isCurrent: boolean;
  onSelect: (plan: BillingPlan) => void;
  loading?: boolean;
  selectLabel?: string;
}

export function PlanCard({ plan, isCurrent, onSelect, loading, selectLabel }: PlanCardProps) {
  const { t } = useTranslation();
  const isFree = plan.type === PlanType.Free;
  const copy: PlanCopy | null = getPlanCopy(t, plan.type);

  const priceLine = isFree
    ? t('billing.freeLabel', 'Free')
    : formatMinorAsCurrency(plan.price, plan.currency ?? 'usd');

  return (
    <View
      style={[
        styles.card,
        isCurrent && styles.cardCurrent,
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {plan.label}
        </ThemedText>
        <View style={styles.priceRow}>
          <ThemedText style={styles.price}>{priceLine}</ThemedText>
          {!isFree ? (
            <ThemedText style={styles.subline}>
              {t('billing.perMonth', 'per month')}
            </ThemedText>
          ) : null}
        </View>
        {copy ? (
          <ThemedText style={styles.tagline}>{copy.tagline}</ThemedText>
        ) : null}
      </View>

      {copy ? (
        <View style={styles.features}>
          {copy.includesBridge ? (
            <ThemedText style={styles.includesBridge}>{copy.includesBridge}</ThemedText>
          ) : null}
          {copy.bullets.map((item, index) => (
            <View key={`${plan.type}-${index}`} style={styles.featureRow}>
              <View style={styles.dot} />
              <ThemedText style={styles.featureText}>{item}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      <Button
        variant={isCurrent ? 'secondary' : 'primary'}
        style={styles.cta}
        onPress={() => onSelect(plan)}
        disabled={isCurrent || (isFree && !isCurrent)}
        loading={loading}
      >
        {isCurrent
          ? t('billing.currentPlan', 'Current plan')
          : isFree
            ? t('billing.included', 'Included')
            : (selectLabel ?? t('billing.choosePlan', 'Choose plan'))}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    gap: 8,
  },
  cardCurrent: {
    borderColor: Colors.primary,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    color: Colors.black,
  },
  subline: {
    fontSize: 12,
    color: Colors.grey,
  },
  tagline: {
    fontSize: 13,
    color: Colors.grey,
    marginTop: 4,
  },
  features: {
    gap: 6,
    marginTop: 4,
  },
  includesBridge: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.grey,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  featureText: {
    fontSize: 13,
    color: Colors.black,
    flex: 1,
    lineHeight: 17,
  },
  cta: {
    marginTop: 2,
  },
});

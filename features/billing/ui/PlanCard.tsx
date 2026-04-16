import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

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
}

export function PlanCard({ plan, isCurrent, onSelect, loading }: PlanCardProps) {
  const { t } = useTranslation();
  const isFree = plan.type === PlanType.Free;
  const copy: PlanCopy | null = getPlanCopy(plan.type);

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
        <ThemedText style={styles.price}>{priceLine}</ThemedText>
        <ThemedText style={styles.subline}>
          {t('billing.perMonth', 'per month')}
        </ThemedText>
        {copy ? (
          <ThemedText style={styles.tagline}>{copy.tagline}</ThemedText>
        ) : null}
      </View>

      {copy ? (
        <View style={styles.features}>
          {copy.bullets.map((item) => (
            <View key={item} style={styles.featureRow}>
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
            : t('billing.choosePlan', 'Choose plan')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.greyHover,
    gap: 10,
  },
  cardCurrent: {
    borderColor: Colors.primary,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    color: Colors.primary,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
  },
  subline: {
    fontSize: 13,
    color: Colors.grey,
  },
  tagline: {
    fontSize: 14,
    color: Colors.grey,
    marginTop: 6,
  },
  features: {
    gap: 8,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  featureText: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
    lineHeight: 18,
  },
  cta: {
    marginTop: 6,
  },
});

export type SubscriptionBadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

const SUCCESS: SubscriptionBadgeTone = 'success';
const WARNING: SubscriptionBadgeTone = 'warning';
const DANGER: SubscriptionBadgeTone = 'danger';
const NEUTRAL: SubscriptionBadgeTone = 'neutral';

/** Map API status name (any casing) to badge tone. */
export function subscriptionStatusTone(status: string): SubscriptionBadgeTone {
  const s = status.trim().toLowerCase();
  if (s === 'active' || s === 'trialing') return SUCCESS;
  if (s === 'pending') return WARNING;
  if (s === 'past_due') return DANGER;
  if (s === 'canceled' || s === 'cancelled') return NEUTRAL;
  return NEUTRAL;
}

export const subscriptionBadgeStyles = {
  success: {
    backgroundColor: '#B2F5EA',
    color: '#005451',
  },
  warning: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  danger: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  neutral: {
    backgroundColor: '#EDE7DF',
    color: '#5C5652',
  },
} as const;

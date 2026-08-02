import { subscriptionStatusTone } from './subscriptionStatusBadge';

describe('subscriptionStatusTone', () => {
  it('returns success for active and trialing', () => {
    expect(subscriptionStatusTone('active')).toBe('success');
    expect(subscriptionStatusTone('trialing')).toBe('success');
  });

  it('returns warning for pending', () => {
    expect(subscriptionStatusTone('pending')).toBe('warning');
  });

  it('returns danger for past_due', () => {
    expect(subscriptionStatusTone('past_due')).toBe('danger');
  });

  it('returns neutral for canceled and cancelled spellings', () => {
    expect(subscriptionStatusTone('canceled')).toBe('neutral');
    expect(subscriptionStatusTone('cancelled')).toBe('neutral');
  });

  it('returns neutral for an unrecognized status', () => {
    expect(subscriptionStatusTone('unknown_status')).toBe('neutral');
  });

  it('is case-insensitive and trims whitespace', () => {
    expect(subscriptionStatusTone('  ACTIVE  ')).toBe('success');
  });
});

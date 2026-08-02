import { getPastDueDaysRemaining, PAST_DUE_GRACE_DAYS } from './pastDueGrace';

describe('getPastDueDaysRemaining', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-10T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns null for a null or undefined period end', () => {
    expect(getPastDueDaysRemaining(null)).toBeNull();
    expect(getPastDueDaysRemaining(undefined)).toBeNull();
  });

  it('returns null for an unparseable period end', () => {
    expect(getPastDueDaysRemaining('not-a-date')).toBeNull();
  });

  it('returns the calendar days remaining until the grace deadline', () => {
    // periodEnd 2026-03-08 + 3 grace days = deadline 2026-03-11; "now" is 2026-03-10 -> 1 day left.
    expect(getPastDueDaysRemaining('2026-03-08')).toBe(1);
  });

  it('returns 0 on the exact grace deadline day', () => {
    // periodEnd 2026-03-07 + 3 grace days = deadline 2026-03-10 = "now".
    expect(getPastDueDaysRemaining('2026-03-07')).toBe(0);
  });

  it('returns null once the grace deadline has passed', () => {
    // periodEnd 2026-03-01 + 3 grace days = deadline 2026-03-04, before "now".
    expect(getPastDueDaysRemaining('2026-03-01')).toBeNull();
  });

  it('exposes the grace period length used by the backend contract', () => {
    expect(PAST_DUE_GRACE_DAYS).toBe(3);
  });
});

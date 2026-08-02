import { formatSubscriptionPeriodEnd } from './formatSubscriptionPeriodEnd';

describe('formatSubscriptionPeriodEnd', () => {
  it('returns null for null, undefined, or non-string input', () => {
    expect(formatSubscriptionPeriodEnd(null, 'en')).toBeNull();
    expect(formatSubscriptionPeriodEnd(undefined, 'en')).toBeNull();
  });

  it('returns null for an unparseable ISO string', () => {
    expect(formatSubscriptionPeriodEnd('not-a-date', 'en')).toBeNull();
  });

  it('formats a valid date using the English locale', () => {
    expect(formatSubscriptionPeriodEnd('2026-03-10', 'en')).toBe(
      'Mar 10, 2026',
    );
  });

  it('formats using the Ukrainian locale', () => {
    expect(formatSubscriptionPeriodEnd('2026-03-10', 'uk')).toBe(
      'берез. 10, 2026',
    );
  });

  it('formats using the Spanish locale', () => {
    expect(formatSubscriptionPeriodEnd('2026-03-10', 'es')).toBe(
      'mar 10, 2026',
    );
  });

  it('resolves a region-qualified language tag by its base language', () => {
    expect(formatSubscriptionPeriodEnd('2026-03-10', 'en-US')).toBe(
      'Mar 10, 2026',
    );
  });

  it('falls back to English for an unsupported language', () => {
    expect(formatSubscriptionPeriodEnd('2026-03-10', 'fr')).toBe(
      'Mar 10, 2026',
    );
  });
});

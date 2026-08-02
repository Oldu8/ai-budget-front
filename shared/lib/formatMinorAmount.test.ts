import { formatMinorAsCurrency } from './formatMinorAmount';

const NBSP = ' ';

describe('formatMinorAsCurrency', () => {
  it('formats minor units with a known currency symbol', () => {
    expect(formatMinorAsCurrency(1050, 'USD')).toBe('$10.50');
  });

  it('groups thousands in the major amount', () => {
    expect(formatMinorAsCurrency(123456789, 'USD')).toBe(
      `$1${NBSP}234${NBSP}567.89`,
    );
  });

  it('falls back to the uppercase ISO code when no symbol is known', () => {
    expect(formatMinorAsCurrency(1000, 'XXX')).toBe('10.00 XXX');
  });

  it('is case-insensitive for the currency code', () => {
    expect(formatMinorAsCurrency(1000, 'usd')).toBe('$10.00');
  });
});

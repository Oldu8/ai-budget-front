import { getCurrencySymbol } from './getCurrencySymbol';

describe('getCurrencySymbol', () => {
  it('resolves the symbol for an uppercase ISO code', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
  });

  it('resolves the symbol for a lowercase ISO code (Stripe format)', () => {
    expect(getCurrencySymbol('eur')).toBe('€');
  });

  it('returns an empty string for an unknown currency', () => {
    expect(getCurrencySymbol('XXX')).toBe('');
  });
});

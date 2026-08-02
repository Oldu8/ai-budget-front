import {
  getCurrencyDisplayValue,
  getLanguageDisplayValue,
  getTimezoneDisplayValue,
} from './getSettingDisplayValue';

describe('getCurrencyDisplayValue', () => {
  it('formats a known currency as "CODE (symbol)"', () => {
    expect(getCurrencyDisplayValue('USD')).toBe('USD ($)');
  });

  it('falls back to the raw code for an unknown currency', () => {
    expect(getCurrencyDisplayValue('XXX')).toBe('XXX');
  });

  it('returns undefined for null, undefined, or empty input', () => {
    expect(getCurrencyDisplayValue(null)).toBeUndefined();
    expect(getCurrencyDisplayValue(undefined)).toBeUndefined();
    expect(getCurrencyDisplayValue('')).toBeUndefined();
  });
});

describe('getLanguageDisplayValue', () => {
  it('resolves the label for a known language code', () => {
    expect(getLanguageDisplayValue('uk')).toBe('Українська');
  });

  it('falls back to the raw code for an unknown language', () => {
    expect(getLanguageDisplayValue('fr')).toBe('fr');
  });

  it('returns undefined for null, undefined, or empty input', () => {
    expect(getLanguageDisplayValue(null)).toBeUndefined();
    expect(getLanguageDisplayValue(undefined)).toBeUndefined();
    expect(getLanguageDisplayValue('')).toBeUndefined();
  });
});

describe('getTimezoneDisplayValue', () => {
  it('resolves the UTC badge for a known timezone', () => {
    expect(getTimezoneDisplayValue('America/New_York')).toBe('UTC-05:00');
  });

  it('falls back to the raw value for an unknown timezone', () => {
    expect(getTimezoneDisplayValue('Mars/Olympus_Mons')).toBe(
      'Mars/Olympus_Mons',
    );
  });

  it('returns undefined for null, undefined, or empty input', () => {
    expect(getTimezoneDisplayValue(null)).toBeUndefined();
    expect(getTimezoneDisplayValue(undefined)).toBeUndefined();
    expect(getTimezoneDisplayValue('')).toBeUndefined();
  });
});

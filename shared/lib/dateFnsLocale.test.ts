import { enUS, es, uk } from 'date-fns/locale';

import { getDateFnsLocale } from './dateFnsLocale';

describe('getDateFnsLocale', () => {
  it('resolves a plain language code', () => {
    expect(getDateFnsLocale('uk')).toBe(uk);
    expect(getDateFnsLocale('es')).toBe(es);
  });

  it('resolves a region-qualified language tag by its base language', () => {
    expect(getDateFnsLocale('en-US')).toBe(enUS);
    expect(getDateFnsLocale('uk_UA')).toBe(uk);
  });

  it('falls back to enUS for an unsupported language', () => {
    expect(getDateFnsLocale('fr')).toBe(enUS);
  });

  it('falls back to enUS for an empty string', () => {
    expect(getDateFnsLocale('')).toBe(enUS);
  });
});

import { getMonthDays } from './getMonthDays';

describe('getMonthDays', () => {
  it('returns 1..31 for a 31-day month', () => {
    expect(getMonthDays(2026, 3)).toEqual(
      Array.from({ length: 31 }, (_, i) => i + 1),
    );
  });

  it('returns 1..30 for a 30-day month', () => {
    expect(getMonthDays(2026, 4)).toEqual(
      Array.from({ length: 30 }, (_, i) => i + 1),
    );
  });

  it('returns 1..28 for February in a non-leap year', () => {
    expect(getMonthDays(2026, 2)).toEqual(
      Array.from({ length: 28 }, (_, i) => i + 1),
    );
  });

  it('returns 1..29 for February in a leap year', () => {
    expect(getMonthDays(2024, 2)).toEqual(
      Array.from({ length: 29 }, (_, i) => i + 1),
    );
  });
});

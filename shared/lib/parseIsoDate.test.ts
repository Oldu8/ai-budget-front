import {
  formatDateKey,
  safeParseIsoDateToStartOfDay,
  toDateKey,
} from './parseIsoDate';

describe('toDateKey', () => {
  it('passes through an already-normalized date key', () => {
    expect(toDateKey('2026-03-05')).toBe('2026-03-05');
  });

  it('trims whitespace around an already-normalized date key', () => {
    expect(toDateKey('  2026-03-05  ')).toBe('2026-03-05');
  });

  it('normalizes a full ISO timestamp to its local calendar day', () => {
    expect(toDateKey('2026-03-05T10:00:00.000Z')).toBe('2026-03-05');
  });

  it('falls back to today for an empty string', () => {
    expect(toDateKey('')).toBe(formatDateKey(new Date()));
  });
});

describe('formatDateKey', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    expect(formatDateKey(new Date(2026, 2, 5))).toBe('2026-03-05');
  });

  it('pads single-digit months and days', () => {
    expect(formatDateKey(new Date(2026, 0, 1))).toBe('2026-01-01');
  });
});

describe('safeParseIsoDateToStartOfDay', () => {
  it('parses a YYYY-MM-DD string using local calendar parsing', () => {
    const result = safeParseIsoDateToStartOfDay('2026-03-05');
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(5);
    expect(result.getHours()).toBe(0);
  });

  it('parses a full ISO timestamp to local start of day', () => {
    const result = safeParseIsoDateToStartOfDay('2026-03-05T23:45:00.000Z');
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it('falls back to today start-of-day for an unparseable string', () => {
    const before = new Date();
    const result = safeParseIsoDateToStartOfDay('not-a-date');
    expect(result.getFullYear()).toBe(before.getFullYear());
    expect(result.getMonth()).toBe(before.getMonth());
    expect(result.getDate()).toBe(before.getDate());
    expect(result.getHours()).toBe(0);
  });
});

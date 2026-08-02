import {
  formatCompactMinorAmount,
  formatFullMinorAmount,
} from './formatCompactMinorAmount';

describe('formatCompactMinorAmount', () => {
  it('formats zero', () => {
    expect(formatCompactMinorAmount(0)).toBe('0');
  });

  it('formats a whole amount without decimals', () => {
    expect(formatCompactMinorAmount(100)).toBe('1');
  });

  it('formats a fractional amount, trimming trailing zero cents', () => {
    expect(formatCompactMinorAmount(150)).toBe('1.5');
  });

  it('keeps both cent digits when neither is zero', () => {
    expect(formatCompactMinorAmount(999_999)).toBe('9999.99');
  });

  it('formats negative amounts with a leading minus', () => {
    expect(formatCompactMinorAmount(-250)).toBe('-2.5');
  });

  it('switches to compact "k" notation at the 10,000 major-unit threshold', () => {
    expect(formatCompactMinorAmount(1_000_000)).toBe('10k');
  });

  it('formats compact "k" amounts below 1,000k with one decimal', () => {
    expect(formatCompactMinorAmount(1_234_567)).toBe('12.3k');
  });

  it('switches to compact "M" notation at 1,000,000 major units', () => {
    expect(formatCompactMinorAmount(100_000_000)).toBe('1M');
  });

  it('switches to compact "B" notation at 1,000,000,000 major units', () => {
    expect(formatCompactMinorAmount(250_000_000_000)).toBe('2.5B');
  });

  it('returns "0" for non-finite input', () => {
    expect(formatCompactMinorAmount(NaN)).toBe('0');
    expect(formatCompactMinorAmount(Infinity)).toBe('0');
  });

  it('returns "0" for non-number input', () => {
    expect(formatCompactMinorAmount('123' as unknown as number)).toBe('0');
  });
});

describe('formatFullMinorAmount', () => {
  it('formats zero', () => {
    expect(formatFullMinorAmount(0)).toBe('0');
  });

  it('groups thousands with spaces for a whole amount', () => {
    expect(formatFullMinorAmount(100_000_000)).toBe('1 000 000');
  });

  it('groups thousands with spaces and keeps decimals', () => {
    expect(formatFullMinorAmount(123_456_789)).toBe('1 234 567.89');
  });

  it('does not add grouping below 1,000', () => {
    expect(formatFullMinorAmount(150)).toBe('1.5');
  });

  it('formats negative amounts with a leading minus', () => {
    expect(formatFullMinorAmount(-150)).toBe('-1.5');
  });

  it('returns "0" for non-finite input', () => {
    expect(formatFullMinorAmount(NaN)).toBe('0');
  });
});

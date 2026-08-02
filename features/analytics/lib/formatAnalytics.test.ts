import {
  formatComparedToPreviousLine,
  formatDiffPercent,
  formatSignedMinorCurrency,
} from './formatAnalytics';

const labels = { newLabel: 'New' };

describe('formatDiffPercent', () => {
  it('returns "0%" for a flat direction regardless of the percent value', () => {
    expect(formatDiffPercent(5, 'flat', labels)).toBe('0%');
    expect(formatDiffPercent(null, 'flat', labels)).toBe('0%');
  });

  it('returns the new-label when percent is null and direction is not flat', () => {
    expect(formatDiffPercent(null, 'up', labels)).toBe('New');
  });

  it('formats a positive percent with a leading plus and 2 decimals', () => {
    expect(formatDiffPercent(12.3, 'up', labels)).toBe('+12.30%');
  });

  it('formats a negative percent with a leading minus, using its absolute value', () => {
    expect(formatDiffPercent(-12.3, 'down', labels)).toBe('-12.30%');
  });

  it('caps magnitudes above the display limit', () => {
    expect(formatDiffPercent(1500, 'up', labels)).toBe('+999%+');
    expect(formatDiffPercent(-1500, 'down', labels)).toBe('-999%+');
  });

  it('does not cap a percent exactly at the display limit', () => {
    expect(formatDiffPercent(999, 'up', labels)).toBe('+999.00%');
  });
});

describe('formatSignedMinorCurrency', () => {
  it('formats a flat direction as zero without a sign', () => {
    expect(formatSignedMinorCurrency('flat', 500, 'USD')).toBe('$0.00');
  });

  it('prefixes an "up" direction with a plus sign', () => {
    expect(formatSignedMinorCurrency('up', 1234, 'USD')).toBe('+$12.34');
  });

  it('prefixes a "down" direction with a minus sign', () => {
    expect(formatSignedMinorCurrency('down', 1234, 'USD')).toBe('-$12.34');
  });

  it('uses the absolute amount regardless of the sign of the input', () => {
    expect(formatSignedMinorCurrency('down', -1234, 'USD')).toBe('-$12.34');
  });
});

describe('formatComparedToPreviousLine', () => {
  it('joins the signed amount and the percent with a slash', () => {
    expect(
      formatComparedToPreviousLine('up', 1234, 12.3, 'USD', labels),
    ).toBe('+$12.34 / +12.30%');
  });

  it('uses the new-label for a null percent', () => {
    expect(formatComparedToPreviousLine('up', 1234, null, 'USD', labels)).toBe(
      '+$12.34 / New',
    );
  });
});

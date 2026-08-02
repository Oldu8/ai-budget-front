import { normalizeName, validateName } from './nameValidation';

describe('normalizeName', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeName('  Anna  ')).toBe('Anna');
  });

  it('collapses repeated internal whitespace', () => {
    expect(normalizeName('Anna   Maria')).toBe('Anna Maria');
  });
});

describe('validateName', () => {
  it('rejects an empty value', () => {
    expect(validateName('   ')).toEqual({ valid: false, error: 'Required' });
  });

  it('rejects a value shorter than 2 characters', () => {
    expect(validateName('A')).toEqual({
      valid: false,
      error: 'Enter at least 2 characters',
    });
  });

  it('rejects a value longer than 50 characters', () => {
    expect(validateName('A'.repeat(51))).toEqual({
      valid: false,
      error: 'Maximum 50 characters',
    });
  });

  it('rejects characters outside letters, spaces, hyphens, and apostrophes', () => {
    expect(validateName('Anna123')).toEqual({
      valid: false,
      error: 'Only letters, spaces, hyphens, and apostrophes are allowed',
    });
  });

  it('accepts a plain name', () => {
    expect(validateName('Anna')).toEqual({ valid: true });
  });

  it('accepts hyphenated and apostrophized names', () => {
    expect(validateName("Anne-Marie O'Neil")).toEqual({ valid: true });
  });

  it('accepts unicode letters', () => {
    expect(validateName('Örjan')).toEqual({ valid: true });
  });

  it('validates against the normalized value', () => {
    expect(validateName('  A  ')).toEqual({
      valid: false,
      error: 'Enter at least 2 characters',
    });
  });
});

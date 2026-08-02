import { getInitials } from './getInitials';

describe('getInitials', () => {
  it('returns both initials uppercased when first and last name are given', () => {
    expect(getInitials('John', 'Doe')).toBe('JD');
  });

  it('returns only the first initial when last name is missing', () => {
    expect(getInitials('John', null)).toBe('J');
  });

  it('returns only the last initial when first name is missing', () => {
    expect(getInitials(null, 'Doe')).toBe('D');
  });

  it('returns "User" when both names are missing', () => {
    expect(getInitials(null, null)).toBe('User');
  });

  it('treats a blank/whitespace-only name as missing', () => {
    expect(getInitials('   ', '   ')).toBe('User');
  });

  it('trims surrounding whitespace before taking the initial', () => {
    expect(getInitials('  John  ', '  Doe  ')).toBe('JD');
  });

  it('uppercases a lowercase name', () => {
    expect(getInitials('john', 'doe')).toBe('JD');
  });
});

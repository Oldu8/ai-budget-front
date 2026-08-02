import { groupThousands } from './groupThousands';

describe('groupThousands', () => {
  it('does not group numbers below 1000', () => {
    expect(groupThousands('123')).toBe('123');
  });

  it('groups the integer part with a non-breaking space', () => {
    expect(groupThousands('1234')).toBe('1 234');
  });

  it('groups large integer parts at every 3 digits', () => {
    expect(groupThousands('1234567')).toBe('1 234 567');
  });

  it('preserves the decimal part unchanged', () => {
    expect(groupThousands('1234.56')).toBe('1 234.56');
  });

  it('handles a value with no integer digits before the decimal point', () => {
    expect(groupThousands('.56')).toBe('.56');
  });
});

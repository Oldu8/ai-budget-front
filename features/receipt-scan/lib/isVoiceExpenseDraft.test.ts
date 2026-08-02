import { isVoiceExpenseDraft } from './isVoiceExpenseDraft';

describe('isVoiceExpenseDraft', () => {
  it('returns true when source is "voice_expense"', () => {
    expect(isVoiceExpenseDraft({ source: 'voice_expense' })).toBe(true);
  });

  it('returns true when source is "voice"', () => {
    expect(isVoiceExpenseDraft({ source: 'voice' })).toBe(true);
  });

  it('returns false for an unrelated source', () => {
    expect(isVoiceExpenseDraft({ source: 'receipt_scan' })).toBe(false);
  });

  it('returns false for null, undefined, or non-object input', () => {
    expect(isVoiceExpenseDraft(null)).toBe(false);
    expect(isVoiceExpenseDraft(undefined)).toBe(false);
    expect(isVoiceExpenseDraft('voice')).toBe(false);
  });

  it('returns false when source is missing', () => {
    expect(isVoiceExpenseDraft({})).toBe(false);
  });
});

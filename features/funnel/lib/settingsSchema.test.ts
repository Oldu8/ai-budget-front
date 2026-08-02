import { settingsSchema } from './settingsSchema';

describe('settingsSchema', () => {
  it('accepts a fully populated payload', () => {
    const result = settingsSchema.safeParse({
      currency: 'USD',
      language: 'en',
      timezone: 'Europe/Kyiv',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty currency', () => {
    const result = settingsSchema.safeParse({
      currency: '',
      language: 'en',
      timezone: 'Europe/Kyiv',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty language', () => {
    const result = settingsSchema.safeParse({
      currency: 'USD',
      language: '',
      timezone: 'Europe/Kyiv',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty timezone', () => {
    const result = settingsSchema.safeParse({
      currency: 'USD',
      language: 'en',
      timezone: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a payload missing required fields', () => {
    const result = settingsSchema.safeParse({ currency: 'USD' });
    expect(result.success).toBe(false);
  });
});

import { editProfileSchema } from './editProfileSchema';

function payload(overrides: Record<string, unknown> = {}) {
  return { first_name: 'John', last_name: 'Doe', ...overrides };
}

describe('editProfileSchema', () => {
  it('accepts a valid payload', () => {
    expect(editProfileSchema.safeParse(payload()).success).toBe(true);
  });

  it('rejects an empty first name', () => {
    const result = editProfileSchema.safeParse(payload({ first_name: '  ' }));
    expect(result.success).toBe(false);
  });

  it('rejects an empty last name', () => {
    const result = editProfileSchema.safeParse(payload({ last_name: '  ' }));
    expect(result.success).toBe(false);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = editProfileSchema.safeParse(payload({ first_name: 'A' }));
    expect(result.success).toBe(false);
  });

  it('rejects a name longer than 50 characters', () => {
    const result = editProfileSchema.safeParse(
      payload({ first_name: 'A'.repeat(51) }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects a name with digits or symbols', () => {
    const result = editProfileSchema.safeParse(payload({ first_name: 'John3' }));
    expect(result.success).toBe(false);
  });

  it('accepts hyphenated and apostrophized names', () => {
    const result = editProfileSchema.safeParse(
      payload({ first_name: "Anne-Marie", last_name: "O'Neil" }),
    );
    expect(result.success).toBe(true);
  });

  it('normalizes internal whitespace before validating', () => {
    const result = editProfileSchema.safeParse(
      payload({ first_name: '  John   Paul  ' }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.first_name).toBe('John Paul');
    }
  });
});

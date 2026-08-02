import type { TFunction } from 'i18next';

import { createReceiptItemEditSchema } from './createReceiptItemEditSchema';

const t = ((key: string) => key) as unknown as TFunction;

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    label: 'Milk',
    amount: 2.5,
    subcategoryId: 11,
    ...overrides,
  };
}

describe('createReceiptItemEditSchema', () => {
  const schema = createReceiptItemEditSchema(t);

  it('accepts a valid payload', () => {
    expect(schema.safeParse(validPayload()).success).toBe(true);
  });

  it('rejects an empty label', () => {
    const result = schema.safeParse(validPayload({ label: '  ' }));
    expect(result.success).toBe(false);
  });

  it('rejects a label longer than 120 characters', () => {
    const result = schema.safeParse(validPayload({ label: 'a'.repeat(121) }));
    expect(result.success).toBe(false);
  });

  it('rejects a label with no letters', () => {
    const result = schema.safeParse(validPayload({ label: '12345' }));
    expect(result.success).toBe(false);
  });

  it('rejects a label with disallowed characters', () => {
    const result = schema.safeParse(validPayload({ label: 'Milk <script>' }));
    expect(result.success).toBe(false);
  });

  it('accepts a label with allowed punctuation', () => {
    const result = schema.safeParse(
      validPayload({ label: "Ben & Jerry's (2/1)" }),
    );
    expect(result.success).toBe(true);
  });

  it('rejects an amount below the minimum', () => {
    expect(schema.safeParse(validPayload({ amount: 0 })).success).toBe(false);
  });

  it('rejects an amount above the maximum', () => {
    expect(
      schema.safeParse(validPayload({ amount: 1_000_001 })).success,
    ).toBe(false);
  });

  it('rejects a null subcategoryId', () => {
    expect(
      schema.safeParse(validPayload({ subcategoryId: null })).success,
    ).toBe(false);
  });

  it('rejects a non-positive subcategoryId', () => {
    expect(
      schema.safeParse(validPayload({ subcategoryId: 0 })).success,
    ).toBe(false);
  });
});

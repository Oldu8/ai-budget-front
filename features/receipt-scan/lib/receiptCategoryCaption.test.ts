import type { Category } from '@/entities/category';

import {
  getReceiptItemCategoryCaption,
  getReceiptItemCategoryParts,
} from './receiptCategoryCaption';

function categories(): Category[] {
  return [
    {
      id: 1,
      name: 'groceries',
      label: 'Groceries',
      children: [{ id: 11, name: 'groceries_meat', label: 'Meat' }],
    },
  ];
}

const translate = (_key: string, opts?: { defaultValue?: string }) =>
  opts?.defaultValue ?? '';

describe('getReceiptItemCategoryCaption', () => {
  it('returns an empty string for a null subcategory id', () => {
    expect(getReceiptItemCategoryCaption(categories(), null, translate)).toBe(
      '',
    );
  });

  it('returns an empty string for an unknown subcategory id', () => {
    expect(getReceiptItemCategoryCaption(categories(), 999, translate)).toBe(
      '',
    );
  });

  it('joins parent and subcategory labels with a middle dot', () => {
    expect(getReceiptItemCategoryCaption(categories(), 11, translate)).toBe(
      'Groceries · Meat',
    );
  });
});

describe('getReceiptItemCategoryParts', () => {
  it('returns empty parts for a null subcategory id', () => {
    expect(getReceiptItemCategoryParts(categories(), null, translate)).toEqual(
      {
        parentLabel: null,
        subLabel: null,
        parentName: null,
        categoryName: '',
      },
    );
  });

  it('returns empty parts for an unknown subcategory id', () => {
    expect(getReceiptItemCategoryParts(categories(), 999, translate)).toEqual({
      parentLabel: null,
      subLabel: null,
      parentName: null,
      categoryName: '',
    });
  });

  it('returns parent and sub parts for a known nested subcategory', () => {
    expect(getReceiptItemCategoryParts(categories(), 11, translate)).toEqual({
      parentLabel: 'Groceries',
      subLabel: 'Meat',
      parentName: 'groceries',
      categoryName: 'groceries_meat',
    });
  });
});

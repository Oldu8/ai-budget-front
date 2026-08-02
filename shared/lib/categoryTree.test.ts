import type { Category } from '@/entities/category';

import {
  findParentOfSubcategory,
  findSubcategoryById,
  getSubcategoryDisplayLabel,
  parentCategoriesWithChildren,
} from './categoryTree';

function buildCategories(): Category[] {
  return [
    {
      id: 1,
      name: 'groceries',
      label: 'Groceries',
      children: [
        { id: 11, name: 'groceries_meat', label: 'Meat' },
        { id: 12, name: 'groceries_fish', label: 'Fish' },
      ],
    },
    {
      id: 2,
      name: 'housing',
      label: 'Housing',
      children: [],
    },
    {
      id: 3,
      name: 'other',
      label: 'Other',
    },
  ];
}

describe('parentCategoriesWithChildren', () => {
  it('returns only parents that have at least one child', () => {
    const result = parentCategoriesWithChildren(buildCategories());
    expect(result.map((c) => c.id)).toEqual([1]);
  });
});

describe('findParentOfSubcategory', () => {
  it('finds the parent of a known subcategory id', () => {
    const parent = findParentOfSubcategory(buildCategories(), 11);
    expect(parent?.id).toBe(1);
  });

  it('returns undefined for an unknown subcategory id', () => {
    expect(findParentOfSubcategory(buildCategories(), 999)).toBeUndefined();
  });
});

describe('findSubcategoryById', () => {
  it('finds a known subcategory by id', () => {
    const sub = findSubcategoryById(buildCategories(), 12);
    expect(sub?.name).toBe('groceries_fish');
  });

  it('returns undefined for an unknown subcategory id', () => {
    expect(findSubcategoryById(buildCategories(), 999)).toBeUndefined();
  });
});

describe('getSubcategoryDisplayLabel', () => {
  it('translates using the categories.{slug} key with the label as fallback', () => {
    const translate = jest.fn(
      (_key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? '',
    );
    const result = getSubcategoryDisplayLabel(buildCategories(), 11, translate);
    expect(translate).toHaveBeenCalledWith('categories.groceries_meat', {
      defaultValue: 'Meat',
    });
    expect(result).toBe('Meat');
  });

  it('returns an empty string for an unknown subcategory id', () => {
    const translate = jest.fn();
    expect(getSubcategoryDisplayLabel(buildCategories(), 999, translate)).toBe('');
    expect(translate).not.toHaveBeenCalled();
  });
});

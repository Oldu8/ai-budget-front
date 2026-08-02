import {
  getCategoryMaterialIconName,
  normalizeCategorySlug,
} from './categoryIcons';

describe('normalizeCategorySlug', () => {
  it('lowercases the slug', () => {
    expect(normalizeCategorySlug('Groceries')).toBe('groceries');
  });

  it('replaces spaces and hyphens with underscores', () => {
    expect(normalizeCategorySlug('groceries meat')).toBe('groceries_meat');
    expect(normalizeCategorySlug('groceries-meat')).toBe('groceries_meat');
  });

  it('collapses repeated separators into a single underscore', () => {
    expect(normalizeCategorySlug('groceries -- meat')).toBe('groceries_meat');
  });
});

describe('getCategoryMaterialIconName', () => {
  it('resolves a known parent category', () => {
    expect(getCategoryMaterialIconName('groceries', 'parent')).toBe(
      'local-grocery-store',
    );
  });

  it('resolves a known subcategory', () => {
    expect(getCategoryMaterialIconName('groceries_meat', 'child')).toBe(
      'kebab-dining',
    );
  });

  it('is case- and separator-insensitive when resolving', () => {
    expect(getCategoryMaterialIconName('Groceries Meat', 'child')).toBe(
      'kebab-dining',
    );
  });

  it('falls back to the default icon for an unknown parent category', () => {
    expect(getCategoryMaterialIconName('unknown_category', 'parent')).toBe(
      'more-horiz',
    );
  });

  it('falls back to the default icon for an unknown subcategory', () => {
    expect(getCategoryMaterialIconName('groceries_other', 'child')).toBe(
      'more-horiz',
    );
  });

  it('does not fall back to the parent map for a child lookup', () => {
    // "groceries" only exists in MAIN_CATEGORY_ICONS, not SUBCATEGORY_ICONS.
    expect(getCategoryMaterialIconName('groceries', 'child')).toBe(
      'more-horiz',
    );
  });
});

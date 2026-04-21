import type { Category } from '@/entities/category';
import {
  findParentOfSubcategory,
  findSubcategoryById,
} from '@/shared/lib/categoryTree';

/**
 * Parent and subcategory labels for receipt line display (i18n keys via `translate`).
 */
export function getReceiptItemCategoryCaption(
  categories: Category[],
  subcategoryId: number | null,
  translate: (key: string, opts?: { defaultValue?: string }) => string
): string {
  if (subcategoryId == null) return '';
  const parent = findParentOfSubcategory(categories, subcategoryId);
  const sub = findSubcategoryById(categories, subcategoryId);
  if (!sub) return '';
  const subLabel = translate(`categories.${sub.name}`, {
    defaultValue: sub.label,
  });
  if (!parent) return subLabel;
  const parentLabel = translate(`categories.${parent.name}`, {
    defaultValue: parent.label,
  });
  return `${parentLabel} · ${subLabel}`;
}

export type ReceiptCategoryParts = {
  parentLabel: string | null;
  subLabel: string | null;
  /** Parent category `name` slug when the selection is a subcategory. */
  parentName: string | null;
  /** Selected category `name` slug (subcategory when nested). */
  categoryName: string;
};

/**
 * Separate parent / subcategory labels for tag chips (e.g. receipt line cards).
 */
export function getReceiptItemCategoryParts(
  categories: Category[],
  subcategoryId: number | null,
  translate: (key: string, opts?: { defaultValue?: string }) => string
): ReceiptCategoryParts {
  if (subcategoryId == null) {
    return { parentLabel: null, subLabel: null, parentName: null, categoryName: '' };
  }
  const parent = findParentOfSubcategory(categories, subcategoryId);
  const sub = findSubcategoryById(categories, subcategoryId);
  if (!sub) {
    return { parentLabel: null, subLabel: null, parentName: null, categoryName: '' };
  }
  const subLabel = translate(`categories.${sub.name}`, {
    defaultValue: sub.label,
  });
  if (!parent) {
    return {
      parentLabel: null,
      subLabel,
      parentName: null,
      categoryName: sub.name,
    };
  }
  const parentLabel = translate(`categories.${parent.name}`, {
    defaultValue: parent.label,
  });
  return {
    parentLabel,
    subLabel,
    parentName: parent.name,
    categoryName: sub.name,
  };
}

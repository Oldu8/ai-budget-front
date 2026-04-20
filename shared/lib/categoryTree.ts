import type { Category } from '@/entities/category';

/** Level-1 categories that have children (same shape as API tree). */
function parentCategoriesWithChildren(categories: Category[]): Category[] {
  return categories.filter(
    (c) => c.category_id == null && (c.children?.length ?? 0) > 0
  );
}

export function findParentOfSubcategory(
  categories: Category[],
  subcategoryId: number
): Category | undefined {
  return parentCategoriesWithChildren(categories).find((p) =>
    p.children?.some((c) => c.id === subcategoryId)
  );
}

export function findSubcategoryById(
  categories: Category[],
  subcategoryId: number
): Category | undefined {
  for (const p of parentCategoriesWithChildren(categories)) {
    const sub = p.children?.find((c) => c.id === subcategoryId);
    if (sub) return sub;
  }
  return undefined;
}

/** Subcategory label using `categories.{slug}` i18n keys (same as CategoryGrid / receipts). */
export function getSubcategoryDisplayLabel(
  categories: Category[],
  subcategoryId: number,
  translate: (key: string, opts?: { defaultValue?: string }) => string
): string {
  const sub = findSubcategoryById(categories, subcategoryId);
  if (!sub) return '';
  return translate(`categories.${sub.name}`, { defaultValue: sub.label });
}

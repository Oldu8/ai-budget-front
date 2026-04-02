import type { Category } from '@/entities/category';

function findParentOfSubcategory(
  categories: Category[],
  subcategoryId: number
): Category | undefined {
  const parents = categories.filter(
    (c) => c.category_id == null && (c.children?.length ?? 0) > 0
  );
  return parents.find((p) =>
    p.children?.some((c) => c.id === subcategoryId)
  );
}

function findSubcategory(
  categories: Category[],
  subcategoryId: number
): Category | undefined {
  const parents = categories.filter(
    (c) => c.category_id == null && (c.children?.length ?? 0) > 0
  );
  for (const p of parents) {
    const sub = p.children?.find((c) => c.id === subcategoryId);
    if (sub) return sub;
  }
  return undefined;
}

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
  const sub = findSubcategory(categories, subcategoryId);
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

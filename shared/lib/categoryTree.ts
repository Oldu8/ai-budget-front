import type { Category } from "@/entities/category";

type CategoryIndex = {
  /** Level-1 categories that have children (same shape as API tree). */
  parents: Category[];
  /** subcategory id -> its parent category. */
  subToParent: Map<number, Category>;
  /** subcategory id -> the subcategory itself. */
  subById: Map<number, Category>;
};

/**
 * Indexes are derived once per categories array reference. React Query hands back a
 * stable reference per fetch, so every helper call (and every list row) reuses the
 * same maps instead of re-walking the tree — O(1) lookups, built O(N) once.
 */
const indexCache = new WeakMap<Category[], CategoryIndex>();

function getIndex(categories: Category[]): CategoryIndex {
  const cached = indexCache.get(categories);
  if (cached) return cached;

  const parents: Category[] = [];
  const subToParent = new Map<number, Category>();
  const subById = new Map<number, Category>();

  for (const parent of categories) {
    const children = parent.children;
    if (!children || children.length === 0) continue;
    parents.push(parent);
    for (const child of children) {
      subToParent.set(child.id, parent);
      subById.set(child.id, child);
    }
  }

  const index: CategoryIndex = { parents, subToParent, subById };
  indexCache.set(categories, index);
  return index;
}

/** Level-1 categories that have children (same shape as API tree). */
export function parentCategoriesWithChildren(
  categories: Category[],
): Category[] {
  return getIndex(categories).parents;
}

export function findParentOfSubcategory(
  categories: Category[],
  subcategoryId: number,
): Category | undefined {
  return getIndex(categories).subToParent.get(subcategoryId);
}

export function findSubcategoryById(
  categories: Category[],
  subcategoryId: number,
): Category | undefined {
  return getIndex(categories).subById.get(subcategoryId);
}

/** Subcategory label using `categories.{slug}` i18n keys (same as CategoryGrid / receipts). */
export function getSubcategoryDisplayLabel(
  categories: Category[],
  subcategoryId: number,
  translate: (key: string, opts?: { defaultValue?: string }) => string,
): string {
  const sub = findSubcategoryById(categories, subcategoryId);
  if (!sub) return "";
  return translate(`categories.${sub.name}`, { defaultValue: sub.label });
}

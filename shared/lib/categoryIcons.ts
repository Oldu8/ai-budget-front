import type { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type CategoryMaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

/** Normalizes API `name` / slug for lookup (lowercase, spaces and hyphens → underscores). */
export function normalizeCategorySlug(slug: string): string {
  return slug.toLowerCase().replace(/[\s-]+/g, '_');
}

/**
 * Parent category slugs (Level 1) → Material Icons name.
 * Aligns with product icon list (Outlined / 24px optical).
 */
export const MAIN_CATEGORY_ICONS: Record<string, CategoryMaterialIconName> = {
  home: 'home',
  kids: 'child-care',
  transport: 'directions-bus',
  car: 'directions-car',
  housing: 'domain',
  health: 'medical-services',
  connectivity: 'router',
  subscriptions: 'subscriptions',
  fitness: 'fitness-center',
  smoking: 'smoking-rooms',
  pets: 'pets',
  beauty: 'content-cut',
  leisure: 'celebration',
  shopping: 'shopping-bag',
  gifts: 'redeem',
  work: 'work',
  finance: 'account-balance',
};

/**
 * Subcategory slugs (Level 2) → Material Icons name.
 * Keys are normalized slugs only (unique per subcategory in the product list).
 */
export const SUBCATEGORY_ICONS: Record<string, CategoryMaterialIconName> = {
  // Home
  groceries: 'local-grocery-store',
  snacks: 'cookie',
  drinks: 'local-cafe',
  household: 'cleaning-services',
  // Kids
  clothes: 'checkroom',
  toys: 'smart-toy',
  food_formula: 'baby-changing-station',
  food_and_formula: 'baby-changing-station',
  care_hygiene: 'soap',
  care_and_hygiene: 'soap',
  // Transport
  taxi: 'local-taxi',
  public_transport: 'train',
  flights: 'flight',
  trains: 'directions-railway',
  // Car
  fuel: 'local-gas-station',
  parking: 'local-parking',
  service: 'build',
  car_wash: 'local-car-wash',
  // Housing
  rent: 'key',
  utilities: 'bolt',
  furniture: 'chair',
  repairs: 'handyman',
  // Health
  medicines: 'medication',
  treatment_tests: 'biotech',
  treatment_and_tests: 'biotech',
  // dentistry glyph missing in Material Icons set — use healing (medical)
  dental: 'healing',
  // Connectivity
  mobile_plan: 'smartphone',
  home_internet: 'wifi',
  top_ups: 'currency-exchange',
  topups: 'currency-exchange',
  // Subscriptions feature
  streaming: 'movie',
  apps_services: 'apps',
  apps_and_services: 'apps',
  cloud_storage: 'cloud',
  // Fitness — exercise glyph missing — use directions-run
  gym: 'directions-run',
  trainer: 'person',
  sports: 'sports-soccer',
  equipment: 'high-quality',
  // Smoking
  cigarettes: 'smoke-free',
  vape: 'vape-free',
  // Pets
  food: 'restaurant',
  vet: 'health-and-safety',
  supplies: 'shopping-bag',
  // Beauty
  hygiene: 'sanitizer',
  cosmetics: 'brush',
  salon: 'face',
  skincare: 'spa',
  // Leisure
  cafes_delivery: 'delivery-dining',
  cafes_and_delivery: 'delivery-dining',
  entertainment: 'theater-comedy',
  travel: 'travel-explore',
  hobbies: 'palette',
  // Shopping
  shoes: 'ice-skating',
  electronics: 'devices',
  tools: 'construction',
  // Gifts
  family: 'family-restroom',
  friends: 'group',
  colleagues: 'badge',
  charity: 'volunteer-activism',
  // Work
  courses: 'school',
  expenses: 'receipt-long',
  software: 'terminal',
  // Composite keys when the same sub-label exists under different parents
  work_equipment: 'laptop-mac',
  fitness_equipment: 'high-quality',
  // Finance
  taxes: 'description',
  insurance: 'assured-workload',
  loans: 'credit-score',
  mortgage: 'home-work',
  fees: 'payments',
  // Shared
  other: 'more-horiz',
};

const DEFAULT_ICON: CategoryMaterialIconName = 'more-horiz';

/**
 * Resolves Material Icons glyph name for a category row.
 * Parent rows use `MAIN_CATEGORY_ICONS`; child rows use `SUBCATEGORY_ICONS` (with optional `parentCategorySlug` for composite keys).
 */
export function getCategoryMaterialIconName(
  categoryName: string,
  level: 'parent' | 'child',
  parentCategorySlug?: string
): CategoryMaterialIconName {
  const n = normalizeCategorySlug(categoryName);
  if (level === 'child') {
    if (parentCategorySlug) {
      const composite = `${normalizeCategorySlug(parentCategorySlug)}_${n}`;
      return (
        SUBCATEGORY_ICONS[composite] ?? SUBCATEGORY_ICONS[n] ?? DEFAULT_ICON
      );
    }
    return SUBCATEGORY_ICONS[n] ?? DEFAULT_ICON;
  }
  return MAIN_CATEGORY_ICONS[n] ?? DEFAULT_ICON;
}

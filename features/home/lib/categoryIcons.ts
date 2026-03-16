import type { IconSymbolName } from '@/shared/ui/IconSymbol';

/**
 * Maps main category slug to icon for the expense table.
 * Only parent (main) categories use icons; subcategories have no icon.
 *
 * See .cursor/frontend-spec.en.md for the full category tree.
 */
const MAIN_CATEGORY_ICONS: Record<string, IconSymbolName> = {
  connectivity: 'wifi',
  finance: 'dollarsign.circle.fill',
  gifts: 'gift',
  health: 'heart.fill',
  home: 'house.fill',
  housing: 'building.2.fill',
  leisure: 'gamecontroller.fill',
  shopping: 'bag.fill',
  subscriptions: 'bolt.fill',
  transport: 'car.fill',
  work: 'briefcase.fill',
};

const DEFAULT_ICON: IconSymbolName = 'dollarsign.circle.fill';

export function getCategoryIcon(categorySlug: string): IconSymbolName {
  const normalized = categorySlug.toLowerCase().replace(/\s+/g, '-');
  return MAIN_CATEGORY_ICONS[normalized] ?? DEFAULT_ICON;
}

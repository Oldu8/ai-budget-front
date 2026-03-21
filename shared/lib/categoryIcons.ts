import type { IconSymbolName } from '@/shared/ui/IconSymbol';

/**
 * Safe SF Symbols mapping for AI Budget.
 * Uses common symbols that are much more likely to be supported.
 */
const MAIN_CATEGORY_ICONS: Record<string, IconSymbolName> = {
  beauty: 'leaf.fill',
  car: 'car',
  connectivity: 'wifi',
  finance: 'creditcard',
  gifts: 'gift',
  health: 'bandage.fill',
  home: 'cart',
  housing: 'house',
  kids: 'person.2',
  leisure: 'tv',
  pets: 'hare',
  shopping: 'bag',
  smoking: 'flame',
  subscriptions: 'clock',
  fitness: 'figure.walk',
  transport: 'bus',
  work: 'building.2.fill',
};

const DEFAULT_ICON: IconSymbolName = 'square.grid.2x2';

export function getCategoryIcon(categorySlug: string): IconSymbolName {
  const normalized = categorySlug.toLowerCase().replace(/\s+/g, '-');
  return MAIN_CATEGORY_ICONS[normalized] ?? DEFAULT_ICON;
}

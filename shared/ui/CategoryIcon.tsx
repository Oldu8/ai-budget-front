import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

/** Material Icons use kebab-case; user list uses snake_case — normalize underscores to dashes. */
function toMaterialName(name: MaterialIconName | string): MaterialIconName {
  return String(name).replace(/_/g, '-') as MaterialIconName;
}

interface CategoryIconProps {
  /** Resolved glyph name from `getCategoryMaterialIconName` (snake_case or kebab-case). */
  name: MaterialIconName | string;
  size?: number;
  color: string;
}

/**
 * Renders a category/subcategory icon using Material Icons (Outlined-style set from Expo).
 * Prefer over IconSymbol when the icon is chosen by slug from `getCategoryMaterialIconName`.
 */
export function CategoryIcon({ name, size = 20, color }: CategoryIconProps) {
  return <MaterialIcons name={toMaterialName(name)} size={size} color={color} />;
}

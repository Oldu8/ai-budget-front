import type { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type PreferenceIconName = ComponentProps<typeof MaterialIcons>['name'];

export const PREFERENCES_ICONS: Record<string, PreferenceIconName> = {
  kids: 'child-care',
  car: 'directions-car',
  rent: 'home',
  insurance: 'shield',
  loan: 'account-balance-wallet',
  mortgage: 'domain',
  pets: 'pets',
  fitness: 'fitness-center',
  smoking: 'smoking-rooms',
  beauty: 'spa',
};

export const DEFAULT_ICON: PreferenceIconName = 'category';

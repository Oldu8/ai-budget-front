import type { SelectItem } from '@/shared/ui/SearchableSelect';

export const LANGUAGE_ITEMS: SelectItem[] = [
  {
    label: 'English',
    value: 'en',
    leftIcon: '🇬🇧',
    keywords: ['english', 'en'],
  },
  {
    label: 'Українська',
    value: 'uk',
    leftIcon: '🇺🇦',
    keywords: ['ukrainian', 'uk', 'українська'],
  },
  {
    label: 'Español',
    value: 'es',
    leftIcon: '🇪🇸',
    keywords: ['spanish', 'es', 'español'],
  },
];

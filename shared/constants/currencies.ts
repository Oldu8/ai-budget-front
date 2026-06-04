import type { SelectItem } from '@/shared/ui/SearchableSelect';

export const CURRENCY_ITEMS: SelectItem[] = [
  { label: 'US Dollar', value: 'USD', badge: 'USD', leftIcon: '$', keywords: ['dollar', 'usd'] },
  { label: 'Euro', value: 'EUR', badge: 'EUR', leftIcon: '€', keywords: ['euro', 'eur'] },
  {
    label: 'Ukrainian Hryvnia',
    value: 'UAH',
    badge: 'UAH',
    leftIcon: '₴',
    keywords: ['hryvnia', 'uah'],
  },
  { label: 'Polish Złoty', value: 'PLN', badge: 'PLN', leftIcon: 'zł', keywords: ['zloty', 'pln'] },
];

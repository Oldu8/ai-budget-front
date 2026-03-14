import type { SelectItem } from '@/shared/ui/SearchableSelect';

export const CURRENCY_ITEMS: SelectItem[] = [
  { label: 'US Dollar', value: 'USD', badge: 'USD', leftIcon: '$', keywords: ['dollar', 'usd'] },
  { label: 'Euro', value: 'EUR', badge: 'EUR', leftIcon: '€', keywords: ['euro', 'eur'] },
  { label: 'British Pound', value: 'GBP', badge: 'GBP', leftIcon: '£', keywords: ['pound', 'gbp'] },
  {
    label: 'Ukrainian Hryvnia',
    value: 'UAH',
    badge: 'UAH',
    leftIcon: '₴',
    keywords: ['hryvnia', 'uah'],
  },
  { label: 'Polish Złoty', value: 'PLN', badge: 'PLN', leftIcon: 'zł', keywords: ['zloty', 'pln'] },
  { label: 'Swiss Franc', value: 'CHF', badge: 'CHF', leftIcon: 'Fr', keywords: ['franc', 'chf'] },
  {
    label: 'Canadian Dollar',
    value: 'CAD',
    badge: 'CAD',
    leftIcon: 'C$',
    keywords: ['canadian', 'cad'],
  },
  {
    label: 'Australian Dollar',
    value: 'AUD',
    badge: 'AUD',
    leftIcon: 'A$',
    keywords: ['australian', 'aud'],
  },
  { label: 'Japanese Yen', value: 'JPY', badge: 'JPY', leftIcon: '¥', keywords: ['yen', 'jpy'] },
  { label: 'Chinese Yuan', value: 'CNY', badge: 'CNY', leftIcon: '¥', keywords: ['yuan', 'cny'] },
  { label: 'Russian Ruble', value: 'RUB', badge: 'RUB', leftIcon: '₽', keywords: ['ruble', 'rub'] },
  {
    label: 'Mexican Peso',
    value: 'MXN',
    badge: 'MXN',
    leftIcon: '$',
    keywords: ['peso', 'mxn'],
  },
  {
    label: 'Indian Rupee',
    value: 'INR',
    badge: 'INR',
    leftIcon: '₹',
    keywords: ['rupee', 'inr'],
  },
  {
    label: 'Brazilian Real',
    value: 'BRL',
    badge: 'BRL',
    leftIcon: 'R$',
    keywords: ['real', 'brl'],
  },
];

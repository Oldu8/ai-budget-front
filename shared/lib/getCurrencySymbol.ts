import { CURRENCY_ITEMS } from '@/shared/constants/currencies';

export function getCurrencySymbol(currency: string): string {
  // Case-insensitive: settings store uppercase ISO codes, Stripe returns lowercase.
  const code = currency.toUpperCase();
  const item = CURRENCY_ITEMS.find((c) => c.value === code);
  return item?.leftIcon ?? '';
}

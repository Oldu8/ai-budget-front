import { CURRENCY_ITEMS } from '@/shared/constants/currencies';

export function getCurrencySymbol(currency: string): string {
  const item = CURRENCY_ITEMS.find((c) => c.value === currency);
  return item?.leftIcon ?? '';
}

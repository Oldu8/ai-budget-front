import { getCurrencySymbol } from '@/shared/lib/getCurrencySymbol';

/** Format minor units (cents) as currency text with symbol. */
export function formatMinorAsCurrency(minor: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  const major = minor / 100;
  return `${symbol}${major.toFixed(2)}`;
}

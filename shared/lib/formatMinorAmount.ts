import { getCurrencySymbol } from '@/shared/lib/getCurrencySymbol';
import { groupThousands } from '@/shared/lib/groupThousands';

/** Format minor units (cents) as currency text with symbol (falls back to the ISO code). */
export function formatMinorAsCurrency(minor: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  const major = groupThousands((minor / 100).toFixed(2));
  return symbol ? `${symbol}${major}` : `${major} ${currency.toUpperCase()}`;
}

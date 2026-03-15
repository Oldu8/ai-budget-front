import { CURRENCY_ITEMS } from '@/shared/constants/currencies';
import { LANGUAGE_ITEMS } from '@/shared/constants/languages';
import { TIMEZONE_ITEMS } from '@/shared/constants/timezones';

export function getCurrencyDisplayValue(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  const item = CURRENCY_ITEMS.find((c) => c.value === code);
  return item ? `${item.value} (${item.leftIcon ?? item.badge})` : code;
}

export function getLanguageDisplayValue(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  const item = LANGUAGE_ITEMS.find((l) => l.value === code);
  return item?.label ?? code;
}

export function getTimezoneDisplayValue(tz: string | null | undefined): string | undefined {
  if (!tz) return undefined;
  const item = TIMEZONE_ITEMS.find((t) => t.value === tz);
  return item?.badge ?? item?.label ?? tz;
}

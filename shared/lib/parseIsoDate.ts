import { isValid, parseISO, startOfDay } from 'date-fns';

/**
 * Parse a `YYYY-MM-DD` (or ISO) string to start-of-day in local time.
 * Falls back to today if invalid.
 */
export function safeParseIsoDateToStartOfDay(value: string): Date {
  const d = parseISO(value);
  if (isValid(d)) return startOfDay(d);
  return startOfDay(new Date());
}

import { format, isValid, parse, parseISO, startOfDay } from 'date-fns';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Normalize API / store date strings to `YYYY-MM-DD` (local calendar day). */
export function toDateKey(value: string): string {
  const trimmed = value.trim();
  if (DATE_KEY.test(trimmed)) return trimmed;
  if (!trimmed) return format(startOfDay(new Date()), 'yyyy-MM-dd');
  return format(safeParseIsoDateToStartOfDay(trimmed), 'yyyy-MM-dd');
}

/** Format a form `Date` as `YYYY-MM-DD` for the API. */
export function formatDateKey(date: Date): string {
  return format(startOfDay(date), 'yyyy-MM-dd');
}

/**
 * Parse a `YYYY-MM-DD` (or ISO) string to start-of-day in local time.
 * Date-only strings use local calendar parsing (not UTC midnight).
 */
export function safeParseIsoDateToStartOfDay(value: string): Date {
  const trimmed = value.trim();
  if (DATE_KEY.test(trimmed)) {
    return startOfDay(parse(trimmed, 'yyyy-MM-dd', new Date()));
  }
  const d = parseISO(trimmed);
  if (isValid(d)) return startOfDay(d);
  return startOfDay(new Date());
}

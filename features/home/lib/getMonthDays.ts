import { getDaysInMonth } from 'date-fns';

/**
 * Returns array of day numbers [1, 2, ..., N] for the given month.
 * Handles 28, 29, 30, 31 day months.
 */
export function getMonthDays(year: number, month: number): number[] {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

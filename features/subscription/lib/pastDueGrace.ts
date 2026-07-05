import { addDays, differenceInCalendarDays, isValid, parseISO } from 'date-fns';

/** Must match backend `AppUser::PAST_DUE_GRACE_DAYS`. */
export const PAST_DUE_GRACE_DAYS = 3;

/** Calendar days left before paid access is revoked for a past_due subscription, or null if unknown/already past. */
export function getPastDueDaysRemaining(
  currentPeriodEnd: string | null | undefined
): number | null {
  if (!currentPeriodEnd) return null;
  const periodEnd = parseISO(currentPeriodEnd);
  if (!isValid(periodEnd)) return null;

  const deadline = addDays(periodEnd, PAST_DUE_GRACE_DAYS);
  const daysLeft = differenceInCalendarDays(deadline, new Date());

  return daysLeft >= 0 ? daysLeft : null;
}

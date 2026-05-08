import { differenceInCalendarDays, parseISO } from 'date-fns';

import type {
  AnalyticsDashboardResponse,
  AnalyticsDirection,
} from '@/features/analytics/model/types';

export type AveragePerDayMom = {
  direction: AnalyticsDirection;
  /** Current average_per_day minus previous month’s average (both minor units / day). */
  differenceAmountMinor: number;
  differencePercent: number | null;
};

/** Inclusive calendar days between API date strings `YYYY-MM-DD`. */
function calendarDaysInclusive(fromIso: string, toIso: string): number {
  const from = parseISO(fromIso);
  const to = parseISO(toIso);
  return differenceInCalendarDays(to, from) + 1;
}

/**
 * Month-over-month change for `overview.average_per_day`.
 * Previous month’s average uses the same rule as the backend: integer division of
 * `previous_month_total` by days in that month (from `period.previous_from` / `previous_to`).
 */
export function getAveragePerDayMonthOverMonth(
  data: AnalyticsDashboardResponse,
): AveragePerDayMom {
  const days = calendarDaysInclusive(
    data.period.previous_from,
    data.period.previous_to,
  );
  const previousTotal = data.overview.previous_month_total;
  const previousAvgPerDay =
    days <= 0 ? 0 : Math.floor(previousTotal / days);
  const currentAvgPerDay = data.overview.average_per_day;
  const differenceAmountMinor = currentAvgPerDay - previousAvgPerDay;

  let direction: AnalyticsDirection = 'flat';
  if (differenceAmountMinor > 0) {
    direction = 'up';
  } else if (differenceAmountMinor < 0) {
    direction = 'down';
  }

  let differencePercent: number | null;
  if (previousAvgPerDay === 0) {
    differencePercent = currentAvgPerDay === 0 ? 0 : null;
  } else {
    differencePercent =
      Math.round(
        (differenceAmountMinor * 10000) / previousAvgPerDay,
      ) / 100;
  }

  return {
    direction,
    differenceAmountMinor,
    differencePercent,
  };
}

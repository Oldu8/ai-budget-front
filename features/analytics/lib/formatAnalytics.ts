import type { AnalyticsDirection } from "@/features/analytics/model/types";
import { formatMinorAsCurrency } from "@/shared/lib/formatMinorAmount";

/** Percents whose magnitude exceeds this are shown as e.g. +999%+ to save space in the UI. */
const DISPLAY_PERCENT_MAGNITUDE_LIMIT = 999;

export type FormatAnalyticsLabels = {
  /** e.g. "New" when `difference_percent` is null */
  newLabel: string;
};

/**
 * Percent string for UI: caps extreme values at ±999%+, handles null and flat.
 * API already rounds percents via round($value, 2); we only fix occasional float jitter after JSON decode.
 */
export function formatDiffPercent(
  percent: number | null,
  direction: AnalyticsDirection,
  labels: FormatAnalyticsLabels,
): string {
  if (direction === "flat") {
    return "0%";
  }
  if (percent === null) {
    return labels.newLabel;
  }
  const absolutePercent = Math.abs(percent);
  const negativeOrPositivePrefix = percent < 0 ? "-" : "+";
  if (absolutePercent > DISPLAY_PERCENT_MAGNITUDE_LIMIT) {
    return `${negativeOrPositivePrefix}${DISPLAY_PERCENT_MAGNITUDE_LIMIT}%+`;
  }
  return `${negativeOrPositivePrefix}${absolutePercent.toFixed(2)}%`;
}

/**
 * Signed currency from signed minor units and trend direction (e.g. +€12.34).
 */
export function formatSignedMinorCurrency(
  direction: AnalyticsDirection,
  amountMinor: number,
  currency: string,
): string {
  if (direction === "flat") {
    return formatMinorAsCurrency(0, currency);
  }
  const absoluteAmountMinor = Math.abs(Math.trunc(amountMinor));
  const formattedAmountWithoutDirection = formatMinorAsCurrency(
    absoluteAmountMinor,
    currency,
  );
  if (direction === "down") {
    return `-${formattedAmountWithoutDirection}`;
  }
  return `+${formattedAmountWithoutDirection}`;
}

/**
 * One line for overview "compared to previous month": amount / percent.
 */
export function formatComparedToPreviousLine(
  direction: AnalyticsDirection,
  differenceMinor: number,
  differencePercent: number | null,
  currency: string,
  labels: FormatAnalyticsLabels,
): string {
  const formattedDifferenceAmountSegment = formatSignedMinorCurrency(
    direction,
    differenceMinor,
    currency,
  );
  const formattedDifferencePercentSegment = formatDiffPercent(
    differencePercent,
    direction,
    labels,
  );
  return `${formattedDifferenceAmountSegment} / ${formattedDifferencePercentSegment}`;
}

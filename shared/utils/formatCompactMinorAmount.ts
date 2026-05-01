/**
 * Compact display of money amounts from integer minor units (cents).
 * No locale/currency symbol — for dense table cells.
 */

const COMPACT_THRESHOLD_MAJOR = 10_000;

function isValidMinor(minor: number): boolean {
  return typeof minor === "number" && Number.isFinite(minor);
}

/** Plain major string from non-negative integer minor (no k/M/B). */
function formatPlainMajorFromAbsMinor(absMinor: number): string {
  const intPart = Math.floor(absMinor / 100);
  const frac = absMinor % 100;
  if (frac === 0) {
    return String(intPart);
  }
  const dec = String(frac).padStart(2, "0").replace(/0+$/, "");
  return `${intPart}.${dec}`;
}

/** One decimal place, then trim a trailing “.0” in the number part. */
function formatMaxOneDecimalTrimZero(n: number): string {
  const t = Math.round(n * 10) / 10;
  if (Object.is(t, -0) || t === 0) {
    return "0";
  }
  if (Number.isInteger(t) || Math.abs(t - Math.round(t)) < 1e-9) {
    return String(Math.round(t));
  }
  const s = t.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

/** |major| >= COMPACT_THRESHOLD_MAJOR — k / M / B with at most one decimal, suffix trimmed. */
function formatAbsMajorCompact(absMajor: number): string {
  const roundedK = Math.round((absMajor / 1_000) * 10) / 10;
  const roundedM = Math.round((absMajor / 1_000_000) * 10) / 10;

  if (absMajor >= 1_000_000_000) {
    return `${formatMaxOneDecimalTrimZero(absMajor / 1_000_000_000)}B`;
  }

  if (roundedM >= 1) {
    return `${formatMaxOneDecimalTrimZero(absMajor / 1_000_000)}M`;
  }

  if (roundedK >= 1000) {
    return `${formatMaxOneDecimalTrimZero(absMajor / 1_000_000)}M`;
  }

  return `${formatMaxOneDecimalTrimZero(absMajor / 1_000)}k`;
}

function addSpaceGroupingToIntString(intDigits: string): string {
  if (intDigits.length <= 0) {
    return "0";
  }
  return intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatCompactMinorAmount(minor: number): string {
  if (!isValidMinor(minor)) {
    return "0";
  }
  const sign = minor < 0 ? "-" : "";
  const absMinor = Math.abs(Math.trunc(minor));
  const absMajor = absMinor / 100;

  if (absMajor < COMPACT_THRESHOLD_MAJOR) {
    return sign + formatPlainMajorFromAbsMinor(absMinor);
  }
  return sign + formatAbsMajorCompact(absMajor);
}

/**
 * Full amount with space-separated thousands, no compact suffix. For tooltips / a11y.
 */
export function formatFullMinorAmount(minor: number): string {
  if (!isValidMinor(minor)) {
    return "0";
  }
  const sign = minor < 0 ? "-" : "";
  const absMinor = Math.abs(Math.trunc(minor));
  const plain = formatPlainMajorFromAbsMinor(absMinor);
  const dot = plain.indexOf(".");
  if (dot === -1) {
    return sign + addSpaceGroupingToIntString(plain);
  }
  const intPart = plain.slice(0, dot);
  const frac = plain.slice(dot + 1);
  return sign + addSpaceGroupingToIntString(intPart) + "." + frac;
}

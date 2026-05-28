import type { TFunction } from "i18next";

import { PlanType } from "@/entities/user";
import type { BillingPlanType } from "@/features/billing/types";

const PLAN_TIER_ORDER: readonly BillingPlanType[] = [
  PlanType.Free,
  PlanType.Basic,
  PlanType.Plus,
  PlanType.Premium,
];

export interface PlanCopy {
  tagline: string;
  /** Paid tiers: line like "Everything in Free, plus:" before delta bullets */
  includesBridge?: string;
  bullets: string[];
}

/** Resolves plan tagline + feature bullets for the active i18n language. */
export function getPlanCopy(
  t: TFunction,
  type: BillingPlanType,
): PlanCopy | null {
  if (!Object.values(PlanType).includes(type as PlanType)) return null;
  const raw = t(`billing.planMarketing.${type}`, { returnObjects: true });
  if (!raw || typeof raw !== "object" || !("tagline" in raw && "bullets" in raw)) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const includesBridge =
    typeof o.inheritIntroKey === "string"
      ? t(`billing.planMarketing.${o.inheritIntroKey}`)
      : undefined;
  return {
    tagline: String(o.tagline),
    includesBridge,
    bullets: o.bullets as string[],
  };
}

/** Cumulative feature bullets for the current plan (profile / payment-plan summary). */
export function getPlanFeatureLines(
  t: TFunction,
  type: BillingPlanType,
): string[] {
  const end = PLAN_TIER_ORDER.indexOf(type as PlanType);
  if (end < 0) return [];
  const lines: string[] = [];
  for (let i = 0; i <= end; i++) {
    const copy = getPlanCopy(t, PLAN_TIER_ORDER[i]);
    if (copy) lines.push(...copy.bullets);
  }
  return lines;
}

import type { TFunction } from "i18next";

import { PlanType } from "@/entities/user";
import type { BillingPlanType } from "@/features/billing/types";

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

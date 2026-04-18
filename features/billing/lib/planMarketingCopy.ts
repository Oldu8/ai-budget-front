import { PlanType } from "@/entities/user";
import type { BillingPlanType } from "@/features/billing/types";

export interface PlanCopy {
  tagline: string;
  bullets: string[];
}

// TODO: Move to backend tagline
const copyByPlan: Record<PlanType, PlanCopy> = {
  [PlanType.Free]: {
    tagline: "Start with core scanning",
    bullets: [
      "20 scans per month",
      "Manual expenses unlimited",
      "History: 1 month",
      "Basic categories only",
    ],
  },
  [PlanType.Basic]: {
    tagline: "Essentials for consistent tracking",
    bullets: [
      "200 scans per month",
      "Unlimited history",
      "Custom categories",
      "CSV export",
    ],
  },
  [PlanType.Plus]: {
    tagline: "Automate and analyze",
    bullets: [
      "500 scans per month",
      "Recurring expenses",
      "Analytics dashboard",
      "CSV export",
    ],
  },
  [PlanType.Premium]: {
    tagline: "Advanced insights",
    bullets: [
      "2000 scans per month",
      "Recurring expenses",
      "Advanced analytics + AI insights",
      "CSV export",
    ],
  },
};

export function getPlanCopy(type: BillingPlanType): PlanCopy | null {
  if (!Object.values(PlanType).includes(type as PlanType)) return null;
  return copyByPlan[type as PlanType];
}

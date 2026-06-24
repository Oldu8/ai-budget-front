export type ScannedDraftItem = {
  id: number;
  label: string;
  amount: number;
  categoryId: number | null;
  categoryLabel: string | null;
};

export type ScannedDraft = {
  id: number;
  date: string;
  totalAmount: number;
  createdBy: string;
  confirmedAt: string | null;
  imgPath: string | null;
  rawAiData: unknown;
  /** Original (pre-conversion) currency the receipt was denominated in. */
  originalCurrency: string | null;
  /** True when an approximate (current, not historical) rate was used. */
  rateIsApproximate: boolean;
  items: ScannedDraftItem[];
};

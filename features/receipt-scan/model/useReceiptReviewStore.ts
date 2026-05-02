import { create } from "zustand";

import type {
  ScannedDraft,
  ScannedDraftItem,
} from "@/features/receipt-scan/model/types";

type ReceiptReviewState = {
  transactionId: number | null;
  date: string;
  items: ScannedDraftItem[];
  baselineSnapshot: string | null;
  initFromDraft: (draft: ScannedDraft) => void;
  setDate: (date: string) => void;
  updateItem: (itemId: number, patch: Partial<ScannedDraftItem>) => void;
  removeItem: (itemId: number) => void;
  clear: () => void;
};

function snapshot(date: string, items: ScannedDraftItem[]): string {
  return JSON.stringify({
    date,
    items: items.map((i) => ({
      id: i.id,
      label: i.label,
      amount: i.amount,
      categoryId: i.categoryId,
      categoryLabel: i.categoryLabel,
    })),
  });
}

function cloneItems(items: ScannedDraftItem[]): ScannedDraftItem[] {
  return items.map((i) => ({ ...i }));
}

export const useReceiptReviewStore = create<ReceiptReviewState>((set) => ({
  transactionId: null,
  date: "",
  items: [],
  baselineSnapshot: null,

  initFromDraft: (draft) => {
    const items = cloneItems(draft.items);
    const date = draft.date;
    set({
      transactionId: draft.id,
      date,
      items,
      baselineSnapshot: snapshot(date, items),
    });
  },

  setDate: (date) => set({ date }),

  updateItem: (itemId, patch) =>
    set((s) => ({
      items: s.items.map((row) =>
        row.id === itemId ? { ...row, ...patch } : row,
      ),
    })),

  removeItem: (itemId) =>
    set((s) => ({
      items: s.items.filter((row) => row.id !== itemId),
    })),

  clear: () =>
    set({
      transactionId: null,
      date: "",
      items: [],
      baselineSnapshot: null,
    }),
}));

export function isReceiptReviewDirty(): boolean {
  const { date, items, baselineSnapshot } = useReceiptReviewStore.getState();
  if (!baselineSnapshot) return false;
  return snapshot(date, items) !== baselineSnapshot;
}

export function sumReviewItemsMinor(items: ScannedDraftItem[]): number {
  return items.reduce((acc, i) => acc + i.amount, 0);
}

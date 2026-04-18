import { create } from 'zustand';

export type OpenPaywallParams = {
  title?: string;
  /** Subtitle / reason shown under the title (legacy). */
  message?: string;
  /** Same as `message` — use for paywall opened from a feature gate. */
  reasonText?: string;
};

interface PaywallState {
  isOpen: boolean;
  contextTitle: string | null;
  contextMessage: string | null;
  open: (params?: OpenPaywallParams) => void;
  close: () => void;
}

export const usePaywallStore = create<PaywallState>((set) => ({
  isOpen: false,
  contextTitle: null,
  contextMessage: null,
  open: (params) =>
    set({
      isOpen: true,
      contextTitle: params?.title ?? null,
      contextMessage: params?.reasonText ?? params?.message ?? null,
    }),
  close: () =>
    set({
      isOpen: false,
      contextTitle: null,
      contextMessage: null,
    }),
}));

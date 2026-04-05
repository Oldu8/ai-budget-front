import { create } from 'zustand';
import { setAuthTokens, clearAuthTokens } from '@/shared/api/protectedClient';
import type {
  AppUser,
  AppUserSettings,
  UserSubscription,
  ScanUsage,
} from '@/entities/user';

/** Auth status: idle = not yet checked (before bootstrap); loading = checking/restoring session; authenticated/unauthenticated = resolved. */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type UserState = {
  user: AppUser | null;
  settings: AppUserSettings | null;
  subscription: UserSubscription | null;
  /** From GET /api/me `subscription_status` (normalized with subscription row fallback). */
  subscriptionStatus: string | null;
  scanUsage: ScanUsage | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;

  setTokens: (tokens: { accessToken: string; refreshToken: string } | null) => void;
  setUserData: (data: {
    user: AppUser | null;
    settings?: AppUserSettings | null;
    subscription?: UserSubscription | null;
    subscriptionStatus?: string | null;
    scanUsage?: ScanUsage | null;
  }) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;
  resetAuth: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  settings: null,
  subscription: null,
  subscriptionStatus: null,
  scanUsage: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle',
  error: null,

  setTokens: (tokens) => {
    if (tokens) {
      setAuthTokens(tokens);
      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } else {
      clearAuthTokens();
      set({ accessToken: null, refreshToken: null });
    }
  },

  setUserData: (data) => {
    set((s) => ({
      user: data.user !== undefined ? data.user : s.user,
      settings: data.settings !== undefined ? data.settings : s.settings,
      subscription: data.subscription !== undefined ? data.subscription : s.subscription,
      subscriptionStatus:
        data.subscriptionStatus !== undefined ? data.subscriptionStatus : s.subscriptionStatus,
      scanUsage: data.scanUsage !== undefined ? data.scanUsage : s.scanUsage,
    }));
  },

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  resetAuth: () => {
    clearAuthTokens();
    set({
      user: null,
      settings: null,
      subscription: null,
      subscriptionStatus: null,
      scanUsage: null,
      accessToken: null,
      refreshToken: null,
      status: 'unauthenticated',
      error: null,
    });
  },
}));

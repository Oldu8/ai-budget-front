import { ApiError } from "@/shared/api/client";
import { clearTokens, loadTokens, saveTokens } from "@/shared/storage/tokenStorage";
import { authApi } from "@/features/auth/api/authApi";
import { meApi } from "@/features/auth/api/getMe";
import { useUserStore } from "@/features/auth/model/useUserStore";
import { type MeResponse, type SocialProvider, mapAuthUserToAppUser } from "@/features/auth/types";
import {
  getProviderIdToken,
  SocialAuthCancelledError,
  SocialAuthNotConfiguredError,
} from "@/features/auth/lib/socialAuth";
import { useCallback } from "react";

import { Analytics } from "@/shared/analytics";
import { Crashlytics } from "@/shared/crashlytics";

/** Translation key for the last auth error (e.g. auth.error.invalidCredentials). */
const AUTH_ERROR_KEYS = {
  invalidCredentials: "auth.error.invalidCredentials",
  emailTaken: "auth.error.emailTaken",
  weakPassword: "auth.error.weakPassword",
  network: "auth.error.network",
  socialComingSoon: "auth.error.socialComingSoon",
  generic: "auth.error.generic",
} as const;

function getAuthErrorKey(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return AUTH_ERROR_KEYS.invalidCredentials;
    if (err.status === 422) {
      const body = err.body as
        | { errors?: Record<string, string[]>; message?: string }
        | undefined;
      const msg = body?.errors?.email?.[0] ?? body?.message ?? "";
      if (/taken|already|exists/i.test(String(msg)))
        return AUTH_ERROR_KEYS.emailTaken;
      if (/password|weak/i.test(String(msg)))
        return AUTH_ERROR_KEYS.weakPassword;
      return AUTH_ERROR_KEYS.generic;
    }
  }
  if (err instanceof TypeError && err.message.includes("fetch"))
    return AUTH_ERROR_KEYS.network;
  return AUTH_ERROR_KEYS.generic;
}

export function useAuth() {
  const {
    user,
    settings,
    subscription,
    subscriptionStatus,
    scanUsage,
    status,
    error,
    setTokens,
    setUserData,
    setStatus,
    setError,
    resetAuth,
  } = useUserStore();

  const signUp = useCallback(
    async (email: string, password: string) => {
      setStatus("loading");
      setError(null);
      try {
        const data = await authApi.register({ email, password });
        const tokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
        setTokens(tokens);
        await saveTokens(tokens);
        const appUser = mapAuthUserToAppUser(data.user);
        setUserData({ user: appUser });
        Analytics.setUser(String(appUser.id));
        Crashlytics.setUser(String(appUser.id));
        Analytics.logSignUp("email");
        try {
          const me = await meApi.getMe();
          setUserData({
            user: me.user,
            settings: me.settings,
            subscription: me.subscription,
            subscriptionStatus: me.subscription_status,
            scanUsage: me.scan_usage,
          });
        } catch {
          // Keep user from register response; getMe failure does not surface here
        }
        setStatus("authenticated");
      } catch (err) {
        setError(getAuthErrorKey(err));
        setStatus("unauthenticated");
        throw err;
      }
    },
    [setTokens, setUserData, setStatus, setError],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setStatus("loading");
      setError(null);
      try {
        const data = await authApi.login({ email, password });
        const tokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
        setTokens(tokens);
        await saveTokens(tokens);
        const appUser = mapAuthUserToAppUser(data.user);
        setUserData({
          user: appUser,
          settings: data.settings ?? undefined,
        });
        Analytics.setUser(String(appUser.id));
        Crashlytics.setUser(String(appUser.id));
        Analytics.logLogin("email");
        try {
          const me = await meApi.getMe();
          setUserData({
            user: me.user,
            settings: me.settings,
            subscription: me.subscription,
            subscriptionStatus: me.subscription_status,
            scanUsage: me.scan_usage,
          });
        } catch {
          // Keep user/settings from login response
        }
        setStatus("authenticated");
      } catch (err) {
        setError(getAuthErrorKey(err));
        setStatus("unauthenticated");
        throw err;
      }
    },
    [setTokens, setUserData, setStatus, setError],
  );

  const signInWithProvider = useCallback(
    async (provider: SocialProvider) => {
      setStatus("loading");
      setError(null);
      try {
        const { idToken, name } = await getProviderIdToken(provider);
        const data = await authApi.social({ provider, id_token: idToken, name });
        const tokens = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
        setTokens(tokens);
        await saveTokens(tokens);
        const appUser = mapAuthUserToAppUser(data.user);
        setUserData({
          user: appUser,
          settings: data.settings ?? undefined,
        });
        Analytics.setUser(String(appUser.id));
        Crashlytics.setUser(String(appUser.id));
        // Social sign-in can be a first-time sign-up or a return login; the
        // backend does not distinguish them here, so we log it as a login.
        Analytics.logLogin(provider === "apple" ? "apple" : "google");
        try {
          const me = await meApi.getMe();
          setUserData({
            user: me.user,
            settings: me.settings,
            subscription: me.subscription,
            subscriptionStatus: me.subscription_status,
            scanUsage: me.scan_usage,
          });
        } catch {
          // Keep user/settings from social response
        }
        setStatus("authenticated");
      } catch (err) {
        // User dismissed the native sheet — not an error, just stay on the screen.
        if (err instanceof SocialAuthCancelledError) {
          setStatus("unauthenticated");
          return;
        }
        if (err instanceof SocialAuthNotConfiguredError) {
          setError(AUTH_ERROR_KEYS.socialComingSoon);
        } else {
          setError(getAuthErrorKey(err));
        }
        setStatus("unauthenticated");
        throw err;
      }
    },
    [setTokens, setUserData, setStatus, setError],
  );

  const signOut = useCallback(async () => {
    const refreshToken = useUserStore.getState().refreshToken;
    try {
      if (refreshToken) {
        await authApi.logout({ refresh_token: refreshToken });
      }
    } catch {
      // Ignore non-200 on logout
    }
    await clearTokens();
    resetAuth();
    Analytics.setUser(null);
    Crashlytics.setUser(null);
  }, [resetAuth]);

  /** Soft-delete account, then clear local session (tokens already revoked server-side). */
  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    await clearTokens();
    resetAuth();
    Analytics.setUser(null);
    Crashlytics.setUser(null);
  }, [resetAuth]);

  /** Change password for a user who already has one. Returns true on success. */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const refreshToken = useUserStore.getState().refreshToken;
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        refresh_token: refreshToken ?? undefined,
      });
    },
    [],
  );

  const bootstrapAuth = useCallback(async () => {
    if (useUserStore.getState().status !== "idle") return;
    setStatus("loading");
    setError(null);
    try {
      const tokens = await loadTokens();
      if (!tokens) {
        setStatus("unauthenticated");
        return;
      }
      setTokens(tokens);

      let me: MeResponse;
      try {
        me = await meApi.getMe();
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 401)) throw err;

        const refreshData = await authApi.refresh({
          refresh_token: tokens.refreshToken,
        });
        const newTokens = {
          accessToken: refreshData.access_token,
          refreshToken: refreshData.refresh_token,
        };
        setTokens(newTokens);
        await saveTokens(newTokens);

        me = await meApi.getMe();
      }

      setUserData({
        user: me.user,
        settings: me.settings,
        subscription: me.subscription,
        subscriptionStatus: me.subscription_status,
        scanUsage: me.scan_usage,
      });
      setStatus("authenticated");
    } catch {
      await clearTokens();
      resetAuth();
    }
  }, [setTokens, setUserData, setStatus, setError, resetAuth]);

  const setErrorDisplay = useCallback((message: string | null) => {
    useUserStore.getState().setError(message);
  }, []);

  const refetchMe = useCallback(async () => {
    if (useUserStore.getState().status !== "authenticated") return;
    try {
      const me = await meApi.getMe();
      setUserData({
        user: me.user,
        settings: me.settings,
        subscription: me.subscription,
        subscriptionStatus: me.subscription_status,
        scanUsage: me.scan_usage,
      });
    } catch {
      // Silent fail; keep existing data
    }
  }, [setUserData]);

  return {
    user,
    settings,
    subscription,
    subscriptionStatus,
    scanUsage,
    status,
    error,
    setError: setErrorDisplay,
    signUp,
    signIn,
    signInWithProvider,
    changePassword,
    signOut,
    deleteAccount,
    bootstrapAuth,
    refetchMe,
  };
}

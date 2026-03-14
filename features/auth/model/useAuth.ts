import { api, ApiError } from "@/shared/api/client";
import { clearTokens, loadTokens, saveTokens } from "@/shared/storage/tokenStorage";
import { authApi } from "@/features/auth/api/authApi";
import { meApi } from "@/features/auth/api/getMe";
import { useUserStore } from "@/features/auth/model/useUserStore";
import { type MeResponse, mapAuthUserToAppUser } from "@/features/auth/types";
import { useCallback } from "react";

/** Translation key for the last auth error (e.g. auth.error.invalidCredentials). */
const AUTH_ERROR_KEYS = {
  invalidCredentials: "auth.error.invalidCredentials",
  emailTaken: "auth.error.emailTaken",
  weakPassword: "auth.error.weakPassword",
  network: "auth.error.network",
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
        setUserData({ user: mapAuthUserToAppUser(data.user) });
        try {
          const me = await meApi.getMe();
          setUserData({
            user: me.user,
            settings: me.settings,
            subscription: me.subscription,
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
        setUserData({
          user: mapAuthUserToAppUser(data.user),
          settings: data.settings ?? undefined,
        });
        try {
          const me = await meApi.getMe();
          setUserData({
            user: me.user,
            settings: me.settings,
            subscription: me.subscription,
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

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore non-200 on logout
    }
    await clearTokens();
    resetAuth();
  }, [resetAuth]);

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
        me = await api.get<MeResponse>("/api/me", {
          accessToken: tokens.accessToken,
        });
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

        me = await api.get<MeResponse>("/api/me", {
          accessToken: newTokens.accessToken,
        });
      }

      setUserData({
        user: me.user,
        settings: me.settings,
        subscription: me.subscription,
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

  return {
    user,
    settings,
    subscription,
    scanUsage,
    status,
    error,
    setError: setErrorDisplay,
    signUp,
    signIn,
    signOut,
    bootstrapAuth,
  };
}

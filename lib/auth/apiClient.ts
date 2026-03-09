import { env } from '@/constants/env';
import { ApiError, api } from '@/lib/api';
import { saveTokens as persistTokens } from '@/lib/auth/tokenStorage';

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;
let authErrorHandler: (() => void) | null = null;
let onTokensRefreshed: ((tokens: { accessToken: string; refreshToken: string }) => void) | null = null;

export function setAuthTokens(tokens: { accessToken: string; refreshToken: string } | null): void {
  if (tokens) {
    inMemoryAccessToken = tokens.accessToken;
    inMemoryRefreshToken = tokens.refreshToken;
  } else {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
  }
}

export function clearAuthTokens(): void {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
}

export function getAuthTokens(): { accessToken: string; refreshToken: string } | null {
  if (inMemoryAccessToken && inMemoryRefreshToken) {
    return { accessToken: inMemoryAccessToken, refreshToken: inMemoryRefreshToken };
  }
  return null;
}

export function setAuthErrorHandler(handler: (() => void) | null): void {
  authErrorHandler = handler;
}

export function setOnTokensRefreshed(
  callback: ((tokens: { accessToken: string; refreshToken: string }) => void) | null
): void {
  onTokensRefreshed = callback;
}

/** Performs refresh request with raw fetch to avoid circular dependency on api. */
async function performRefresh(): Promise<{ access_token: string; refresh_token: string }> {
  const refreshToken = inMemoryRefreshToken;
  if (!refreshToken) {
    throw new ApiError('No refresh token', 401);
  }
  const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      (data?.message as string) || `Refresh failed: ${response.status}`,
      response.status,
      data,
      response
    );
  }
  return data as { access_token: string; refresh_token: string };
}

/**
 * Protected GET: sends Bearer token, on 401 attempts refresh and retries once.
 * Use for any endpoint that requires Authorization.
 */
export async function protectedGet<T = unknown>(
  path: string,
  retrying = false
): Promise<T> {
  const tokens = getAuthTokens();
  try {
    return await api.get<T>(path, { accessToken: tokens?.accessToken ?? null });
  } catch (err) {
    if (!retrying && err instanceof ApiError && err.status === 401) {
      try {
        const newTokens = await performRefresh();
        const pair = {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        };
        setAuthTokens(pair);
        await persistTokens(pair);
        onTokensRefreshed?.(pair);
        return protectedGet<T>(path, true);
      } catch {
        authErrorHandler?.();
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Protected POST: sends Bearer token, on 401 attempts refresh and retries once.
 */
export async function protectedPost<T = unknown>(
  path: string,
  body?: unknown,
  retrying = false
): Promise<T> {
  const tokens = getAuthTokens();
  try {
    return await api.post<T>(path, body, { accessToken: tokens?.accessToken ?? null });
  } catch (err) {
    if (!retrying && err instanceof ApiError && err.status === 401) {
      try {
        const newTokens = await performRefresh();
        const pair = {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        };
        setAuthTokens(pair);
        await persistTokens(pair);
        onTokensRefreshed?.(pair);
        return protectedPost<T>(path, body, true);
      } catch {
        authErrorHandler?.();
        throw err;
      }
    }
    throw err;
  }
}

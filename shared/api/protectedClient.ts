import { env } from '@/shared/constants/env';
import { ApiError, api } from '@/shared/api/client';
import { saveTokens as persistTokens } from '@/shared/storage/tokenStorage';

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;
let authErrorHandler: (() => void | Promise<void>) | null = null;
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

export function setAuthErrorHandler(handler: (() => void | Promise<void>) | null): void {
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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (env.apiSecret) {
    headers['X-API-Key'] = env.apiSecret;
  }
  const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => ({})) : {};
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
        await authErrorHandler?.();
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
        await authErrorHandler?.();
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Protected PUT: sends Bearer token, on 401 attempts refresh and retries once.
 */
export async function protectedPut<T = unknown>(
  path: string,
  body?: unknown,
  retrying = false
): Promise<T> {
  const tokens = getAuthTokens();
  try {
    return await api.put<T>(path, body, { accessToken: tokens?.accessToken ?? null });
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
        return protectedPut<T>(path, body, true);
      } catch {
        await authErrorHandler?.();
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Protected PATCH: sends Bearer token, on 401 attempts refresh and retries once.
 */
export async function protectedPatch<T = unknown>(
  path: string,
  body?: unknown,
  retrying = false
): Promise<T> {
  const tokens = getAuthTokens();
  try {
    return await api.patch<T>(path, body, { accessToken: tokens?.accessToken ?? null });
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
        return protectedPatch<T>(path, body, true);
      } catch {
        await authErrorHandler?.();
        throw err;
      }
    }
    throw err;
  }
}

import { act, renderHook } from '@testing-library/react-native';

import { ApiError } from '@/shared/api/client';
import { authApi } from '@/features/auth/api/authApi';
import { meApi } from '@/features/auth/api/getMe';
import * as tokenStorage from '@/shared/storage/tokenStorage';
import {
  getProviderIdToken,
  SocialAuthCancelledError,
  SocialAuthNotConfiguredError,
} from '@/features/auth/lib/socialAuth';
import { useUserStore } from '@/features/auth/model/useUserStore';

import { useAuth } from './useAuth';

jest.mock('@/features/auth/api/authApi');
jest.mock('@/features/auth/api/getMe');
jest.mock('@/shared/storage/tokenStorage');
jest.mock('@/features/auth/lib/socialAuth', () => {
  const actual = jest.requireActual('@/features/auth/lib/socialAuth');
  return { ...actual, getProviderIdToken: jest.fn() };
});

const authApiMock = jest.mocked(authApi);
const meApiMock = jest.mocked(meApi);
const tokenStorageMock = jest.mocked(tokenStorage);
const getProviderIdTokenMock = jest.mocked(getProviderIdToken);

/** Runs `fn` inside `act`, swallowing its rejection so pending effects still flush before we inspect `result.current`. */
async function actAndCatch(fn: () => Promise<unknown>): Promise<unknown> {
  let caught: unknown;
  await act(async () => {
    try {
      await fn();
    } catch (e) {
      caught = e;
    }
  });
  return caught;
}

function resetStore() {
  useUserStore.setState({
    user: null,
    settings: null,
    subscription: null,
    subscriptionStatus: null,
    scanUsage: null,
    accessToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
  });
}

const authUser = {
  id: 1,
  email: 'a@b.com',
  first_name: null,
  last_name: null,
  email_verified_at: null,
};

const meResponse = {
  user: { ...authUser, first_name: 'Ann' },
  subscription: null,
  subscription_status: 'active',
  scan_usage: { scans_remaining: 5, scans_limit: 10, period_end: null },
  settings: undefined,
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
  });

  it('signUp: authenticates and enriches the user via getMe on success', async () => {
    authApiMock.register.mockResolvedValue({
      access_token: 'a1',
      refresh_token: 'r1',
      user: authUser,
    });
    meApiMock.getMe.mockResolvedValue(meResponse);

    const { result } = await renderHook(() => useAuth());
    await act(async () => {
      await result.current.signUp('a@b.com', 'password1');
    });

    expect(result.current.status).toBe('authenticated');
    expect(result.current.user?.first_name).toBe('Ann');
    expect(result.current.subscriptionStatus).toBe('active');
    expect(tokenStorageMock.saveTokens).toHaveBeenCalledWith({
      accessToken: 'a1',
      refreshToken: 'r1',
    });
  });

  it('signUp: maps a 422 "email taken" error and rethrows', async () => {
    authApiMock.register.mockRejectedValue(
      new ApiError('failed', 422, { message: 'The email has already been taken.' }),
    );

    const { result } = await renderHook(() => useAuth());
    const caught = await actAndCatch(() =>
      result.current.signUp('a@b.com', 'password1'),
    );

    expect(caught).toBeInstanceOf(ApiError);
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.error).toBe('auth.error.emailTaken');
  });

  it('signIn: maps a 401 to invalidCredentials', async () => {
    authApiMock.login.mockRejectedValue(new ApiError('failed', 401));

    const { result } = await renderHook(() => useAuth());
    const caught = await actAndCatch(() => result.current.signIn('a@b.com', 'wrong'));

    expect(caught).toBeInstanceOf(ApiError);
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.error).toBe('auth.error.invalidCredentials');
  });

  it('signIn: maps a fetch TypeError to a network error', async () => {
    authApiMock.login.mockRejectedValue(new TypeError('Failed to fetch'));

    const { result } = await renderHook(() => useAuth());
    const caught = await actAndCatch(() =>
      result.current.signIn('a@b.com', 'password1'),
    );

    expect(caught).toBeInstanceOf(TypeError);
    expect(result.current.error).toBe('auth.error.network');
  });

  it('signOut: revokes the refresh token, clears storage, and resets the store', async () => {
    useUserStore.getState().setTokens({ accessToken: 'a1', refreshToken: 'r1' });
    authApiMock.logout.mockResolvedValue(undefined);

    const { result } = await renderHook(() => useAuth());
    await act(async () => {
      await result.current.signOut();
    });

    expect(authApiMock.logout).toHaveBeenCalledWith({ refresh_token: 'r1' });
    expect(tokenStorageMock.clearTokens).toHaveBeenCalled();
    expect(result.current.status).toBe('unauthenticated');
    expect(useUserStore.getState().accessToken).toBeNull();
  });

  it('bootstrapAuth: leaves status unauthenticated when no stored tokens exist', async () => {
    tokenStorageMock.loadTokens.mockResolvedValue(null);

    const { result } = await renderHook(() => useAuth());
    await act(async () => {
      await result.current.bootstrapAuth();
    });

    expect(result.current.status).toBe('unauthenticated');
    expect(meApiMock.getMe).not.toHaveBeenCalled();
  });

  it('bootstrapAuth: is a no-op once status has already left idle', async () => {
    useUserStore.getState().setStatus('authenticated');

    const { result } = await renderHook(() => useAuth());
    await act(async () => {
      await result.current.bootstrapAuth();
    });

    expect(tokenStorageMock.loadTokens).not.toHaveBeenCalled();
  });

  it('signInWithProvider: a cancelled native sheet resets status without setting an error', async () => {
    getProviderIdTokenMock.mockRejectedValue(new SocialAuthCancelledError());

    const { result } = await renderHook(() => useAuth());
    await act(async () => {
      await result.current.signInWithProvider('apple');
    });

    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.error).toBeNull();
  });

  it('signInWithProvider: an unconfigured provider surfaces the "coming soon" error and rethrows', async () => {
    getProviderIdTokenMock.mockRejectedValue(new SocialAuthNotConfiguredError('google'));

    const { result } = await renderHook(() => useAuth());
    const caught = await actAndCatch(() =>
      result.current.signInWithProvider('google'),
    );

    expect(caught).toBeInstanceOf(SocialAuthNotConfiguredError);
    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.error).toBe('auth.error.socialComingSoon');
  });
});

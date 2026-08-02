import { getAuthTokens } from '@/shared/api/protectedClient';

import { useUserStore } from './useUserStore';

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

describe('useUserStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts idle with no user or tokens', () => {
    const state = useUserStore.getState();
    expect(state.status).toBe('idle');
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('setTokens stores tokens in state and in the protected client', () => {
    useUserStore
      .getState()
      .setTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    expect(useUserStore.getState().accessToken).toBe('access-1');
    expect(useUserStore.getState().refreshToken).toBe('refresh-1');
    expect(getAuthTokens()).toEqual({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    });
  });

  it('setTokens(null) clears tokens from state and the protected client', () => {
    useUserStore
      .getState()
      .setTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    useUserStore.getState().setTokens(null);
    expect(useUserStore.getState().accessToken).toBeNull();
    expect(useUserStore.getState().refreshToken).toBeNull();
    expect(getAuthTokens()).toBeNull();
  });

  it('setUserData merges only the provided fields, leaving others untouched', () => {
    useUserStore.getState().setUserData({
      user: { id: 1, email: 'a@b.com', first_name: null, last_name: null, email_verified_at: null },
      subscriptionStatus: 'active',
    });
    useUserStore.getState().setUserData({ subscriptionStatus: 'past_due' });

    const state = useUserStore.getState();
    expect(state.user?.id).toBe(1);
    expect(state.subscriptionStatus).toBe('past_due');
  });

  it('setUserData(field: undefined) is a no-op for that field, but null overwrites it', () => {
    useUserStore.getState().setUserData({
      user: { id: 1, email: 'a@b.com', first_name: null, last_name: null, email_verified_at: null },
    });
    useUserStore.getState().setUserData({ user: undefined });
    expect(useUserStore.getState().user?.id).toBe(1);

    useUserStore.getState().setUserData({ user: null });
    expect(useUserStore.getState().user).toBeNull();
  });

  it('setStatus and setError update their fields independently', () => {
    useUserStore.getState().setStatus('authenticated');
    useUserStore.getState().setError('some.error.key');
    const state = useUserStore.getState();
    expect(state.status).toBe('authenticated');
    expect(state.error).toBe('some.error.key');
  });

  it('resetAuth clears all session data and tokens, and sets status to unauthenticated', () => {
    useUserStore.getState().setTokens({ accessToken: 'a', refreshToken: 'r' });
    useUserStore.getState().setUserData({
      user: { id: 1, email: 'a@b.com', first_name: null, last_name: null, email_verified_at: null },
      subscriptionStatus: 'active',
    });
    useUserStore.getState().setError('boom');

    useUserStore.getState().resetAuth();

    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.subscriptionStatus).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.status).toBe('unauthenticated');
    expect(state.error).toBeNull();
    expect(getAuthTokens()).toBeNull();
  });
});

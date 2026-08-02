import { renderHook } from '@testing-library/react-native';

import { PlanType } from '@/entities/user';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';

import { usePaidFeatureGate } from './usePaidFeatureGate';
import { usePaywallStore } from './usePaywallStore';

jest.mock('@/features/auth/providers/AuthProvider', () => ({
  useAuthContext: jest.fn(),
}));

const useAuthContextMock = jest.mocked(useAuthContext);

function resetPaywallStore() {
  usePaywallStore.setState({ isOpen: false, contextTitle: null, contextMessage: null });
}

function mockSubscription(planType: string | null) {
  useAuthContextMock.mockReturnValue({
    subscription: planType
      ? { plan: { type: planType } }
      : null,
  } as unknown as ReturnType<typeof useAuthContext>);
}

describe('usePaidFeatureGate', () => {
  beforeEach(() => {
    resetPaywallStore();
  });

  it('grants access and calls onGranted when the plan includes the feature', async () => {
    mockSubscription(PlanType.Premium);
    const { result } = await renderHook(() => usePaidFeatureGate());
    const onGranted = jest.fn();

    result.current.requestAccess('voiceExpense', onGranted, { title: 'Voice' });

    expect(onGranted).toHaveBeenCalledTimes(1);
    expect(usePaywallStore.getState().isOpen).toBe(false);
  });

  it('opens the paywall with the given copy when the plan lacks the feature', async () => {
    mockSubscription(PlanType.Free);
    const { result } = await renderHook(() => usePaidFeatureGate());
    const onGranted = jest.fn();

    result.current.requestAccess('voiceExpense', onGranted, {
      title: 'Go Premium',
      reasonText: 'Unlock voice entry',
    });

    expect(onGranted).not.toHaveBeenCalled();
    const state = usePaywallStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.contextTitle).toBe('Go Premium');
    expect(state.contextMessage).toBe('Unlock voice entry');
  });

  it('defaults to the Free plan when there is no subscription', async () => {
    mockSubscription(null);
    const { result } = await renderHook(() => usePaidFeatureGate());
    expect(result.current.planType).toBe(PlanType.Free);
  });

  it('exposes the current plan type', async () => {
    mockSubscription(PlanType.Plus);
    const { result } = await renderHook(() => usePaidFeatureGate());
    expect(result.current.planType).toBe(PlanType.Plus);
  });
});

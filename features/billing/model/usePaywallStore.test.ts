import { usePaywallStore } from './usePaywallStore';

function resetStore() {
  usePaywallStore.setState({
    isOpen: false,
    contextTitle: null,
    contextMessage: null,
  });
}

describe('usePaywallStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts closed with no context', () => {
    const state = usePaywallStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.contextTitle).toBeNull();
    expect(state.contextMessage).toBeNull();
  });

  it('open() with no params opens with null context', () => {
    usePaywallStore.getState().open();
    const state = usePaywallStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.contextTitle).toBeNull();
    expect(state.contextMessage).toBeNull();
  });

  it('open() stores the title and reasonText', () => {
    usePaywallStore.getState().open({ title: 'Go Premium', reasonText: 'Unlock analytics' });
    const state = usePaywallStore.getState();
    expect(state.contextTitle).toBe('Go Premium');
    expect(state.contextMessage).toBe('Unlock analytics');
  });

  it('open() falls back to the legacy message field when reasonText is absent', () => {
    usePaywallStore.getState().open({ title: 'Go Premium', message: 'Legacy reason' });
    expect(usePaywallStore.getState().contextMessage).toBe('Legacy reason');
  });

  it('open() prefers reasonText over the legacy message field', () => {
    usePaywallStore
      .getState()
      .open({ reasonText: 'New reason', message: 'Legacy reason' });
    expect(usePaywallStore.getState().contextMessage).toBe('New reason');
  });

  it('close() resets isOpen and context', () => {
    usePaywallStore.getState().open({ title: 'Go Premium', reasonText: 'Unlock analytics' });
    usePaywallStore.getState().close();
    const state = usePaywallStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.contextTitle).toBeNull();
    expect(state.contextMessage).toBeNull();
  });
});

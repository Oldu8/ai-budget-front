describe('isProviderAvailable', () => {
  afterEach(() => {
    jest.resetModules();
    jest.unmock('expo-constants');
  });

  function loadWithExecutionEnvironment(executionEnvironment: string) {
    jest.resetModules();
    jest.doMock('expo-constants', () => ({
      __esModule: true,
      default: { executionEnvironment },
      ExecutionEnvironment: { StoreClient: 'storeClient' },
    }));
    return require('./socialAuth') as typeof import('./socialAuth');
  }

  it('hides every provider in Expo Go (no native modules available)', () => {
    const { isProviderAvailable } = loadWithExecutionEnvironment('storeClient');
    expect(isProviderAvailable('apple', 'ios')).toBe(false);
    expect(isProviderAvailable('google', 'ios')).toBe(false);
  });

  it('shows Apple only on iOS outside Expo Go', () => {
    const { isProviderAvailable } = loadWithExecutionEnvironment('bare');
    expect(isProviderAvailable('apple', 'ios')).toBe(true);
    expect(isProviderAvailable('apple', 'android')).toBe(false);
  });

  it('keeps Google hidden pending the Android build, even outside Expo Go', () => {
    const { isProviderAvailable } = loadWithExecutionEnvironment('bare');
    expect(isProviderAvailable('google', 'ios')).toBe(false);
    expect(isProviderAvailable('google', 'android')).toBe(false);
  });
});

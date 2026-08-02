import { act, renderHook } from '@testing-library/react-native';

import { useHomeStore } from './homeStore';
import { useSelectedMonth } from './useSelectedMonth';

describe('useSelectedMonth', () => {
  beforeEach(() => {
    useHomeStore.setState({
      selectedDate: new Date(2026, 2, 15),
      expandedIds: new Set(),
    });
  });

  it('derives a 1-indexed month and year from the store date', async () => {
    const { result } = await renderHook(() => useSelectedMonth());
    expect(result.current.year).toBe(2026);
    expect(result.current.month).toBe(3);
  });

  it('setNextMonth advances the derived month', async () => {
    const { result } = await renderHook(() => useSelectedMonth());
    await act(() => result.current.setNextMonth());
    expect(useHomeStore.getState().selectedDate.getMonth()).toBe(3);
  });

  it('setPrevMonth moves the derived month back', async () => {
    const { result } = await renderHook(() => useSelectedMonth());
    await act(() => result.current.setPrevMonth());
    expect(useHomeStore.getState().selectedDate.getMonth()).toBe(1);
  });
});

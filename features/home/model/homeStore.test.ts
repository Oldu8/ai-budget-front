import { useHomeStore } from './homeStore';

function resetStore() {
  useHomeStore.setState({
    selectedDate: new Date(2026, 2, 15),
    expandedIds: new Set(),
  });
}

describe('useHomeStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('setPrevMonth moves the selected date back one month', () => {
    useHomeStore.getState().setPrevMonth();
    const date = useHomeStore.getState().selectedDate;
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1); // February
  });

  it('setNextMonth moves the selected date forward one month', () => {
    useHomeStore.getState().setNextMonth();
    const date = useHomeStore.getState().selectedDate;
    expect(date.getMonth()).toBe(3); // April
  });

  it('setMonth replaces the selected date outright', () => {
    const target = new Date(2027, 0, 1);
    useHomeStore.getState().setMonth(target);
    expect(useHomeStore.getState().selectedDate).toBe(target);
  });

  it('toggleExpanded adds an id the first time and removes it the second time', () => {
    useHomeStore.getState().toggleExpanded(1);
    expect(useHomeStore.getState().expandedIds.has(1)).toBe(true);

    useHomeStore.getState().toggleExpanded(1);
    expect(useHomeStore.getState().expandedIds.has(1)).toBe(false);
  });

  it('toggleExpanded tracks multiple ids independently', () => {
    useHomeStore.getState().toggleExpanded(1);
    useHomeStore.getState().toggleExpanded(2);
    const ids = useHomeStore.getState().expandedIds;
    expect(ids.has(1)).toBe(true);
    expect(ids.has(2)).toBe(true);
  });

  it('collapseAll clears every expanded id', () => {
    useHomeStore.getState().toggleExpanded(1);
    useHomeStore.getState().toggleExpanded(2);
    useHomeStore.getState().collapseAll();
    expect(useHomeStore.getState().expandedIds.size).toBe(0);
  });
});

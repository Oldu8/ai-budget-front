import { create } from 'zustand';
import { addMonths, subMonths } from 'date-fns';

interface HomeState {
  selectedDate: Date;
  expandedIds: Set<number>;
  setPrevMonth: () => void;
  setNextMonth: () => void;
  setMonth: (date: Date) => void;
  toggleExpanded: (id: number) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  selectedDate: new Date(),
  expandedIds: new Set(),

  setPrevMonth: () =>
    set((s) => ({ selectedDate: subMonths(s.selectedDate, 1) })),

  setNextMonth: () =>
    set((s) => ({ selectedDate: addMonths(s.selectedDate, 1) })),

  setMonth: (date) => set({ selectedDate: date }),

  toggleExpanded: (id) =>
    set((s) => {
      const next = new Set(s.expandedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedIds: next };
    }),
}));

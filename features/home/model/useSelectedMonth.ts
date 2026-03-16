import { useHomeStore } from './homeStore';

export function useSelectedMonth() {
  const selectedDate = useHomeStore((s) => s.selectedDate);
  const setPrevMonth = useHomeStore((s) => s.setPrevMonth);
  const setNextMonth = useHomeStore((s) => s.setNextMonth);

  return {
    year: selectedDate.getFullYear(),
    month: selectedDate.getMonth() + 1,
    selectedDate,
    setPrevMonth,
    setNextMonth,
  };
}

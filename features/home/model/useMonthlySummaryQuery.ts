import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { getMonthlySummary } from '@/features/home/api/getMonthlySummary';

export function useMonthlySummaryQuery(year: number, month: number) {
  const date = new Date(year, month - 1);
  const from = format(startOfMonth(date), 'yyyy-MM-dd');
  const to = format(endOfMonth(date), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['home', 'monthly-summary', from, to],
    queryFn: () => getMonthlySummary(from, to),
  });
}

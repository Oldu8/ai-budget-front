import { useQuery } from '@tanstack/react-query';

import { getRecurringExpenses } from '@/features/recurring-expenses/api/getRecurringExpenses';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';

export function useRecurringExpensesQuery(options?: { enabled?: boolean }) {
  const { status } = useAuthContext();
  const extra = options?.enabled ?? true;
  return useQuery({
    queryKey: ['recurring-expenses'],
    queryFn: getRecurringExpenses,
    enabled: status === 'authenticated' && extra,
  });
}

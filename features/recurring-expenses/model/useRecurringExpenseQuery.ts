import { useQuery } from '@tanstack/react-query';

import { getRecurringExpense } from '@/features/recurring-expenses/api/getRecurringExpense';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';

export function useRecurringExpenseQuery(
  id: number | null,
  options?: { enabled?: boolean }
) {
  const { status } = useAuthContext();
  const extra = options?.enabled ?? true;
  return useQuery({
    queryKey: ['recurring-expenses', id],
    queryFn: () => getRecurringExpense(id!),
    enabled:
      status === 'authenticated' && id != null && id > 0 && extra,
  });
}

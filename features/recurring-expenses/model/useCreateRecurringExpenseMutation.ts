import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRecurringExpense } from '@/features/recurring-expenses/api/createRecurringExpense';
import type { CreateRecurringExpensePayload } from '@/features/recurring-expenses/types';

export function useCreateRecurringExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecurringExpensePayload) =>
      createRecurringExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
    },
  });
}

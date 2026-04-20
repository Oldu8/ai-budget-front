import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateRecurringExpense } from '@/features/recurring-expenses/api/updateRecurringExpense';
import type { UpdateRecurringExpensePayload } from '@/features/recurring-expenses/types';

export function useUpdateRecurringExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateRecurringExpensePayload;
    }) => updateRecurringExpense(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses', id] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteRecurringExpense } from '@/features/recurring-expenses/api/deleteRecurringExpense';

export function useDeleteRecurringExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRecurringExpense(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
      queryClient.removeQueries({ queryKey: ['recurring-expenses', id] });
    },
  });
}

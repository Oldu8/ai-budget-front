import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

import { createTransaction } from "@/features/transactions/api/createTransaction";
import {
  createExpenseSchema,
  getDefaultExpenseFormValues,
  type CreateExpenseFormData,
} from "@/features/transactions/lib/createExpenseSchema";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const form = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    mode: "onChange",
    defaultValues: getDefaultExpenseFormValues(),
  });

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const subId = data.subcategoryId;
    if (subId === null || subId <= 0) {
      return Promise.reject(new Error("Subcategory is required"));
    }
    const total_amount = Math.round(data.amount * 100);
    const date = format(data.date, "yyyy-MM-dd");
    return mutation.mutateAsync({
      total_amount,
      date,
      type: "expense",
      category_id: subId,
    });
  });

  const subcategoryId = form.watch("subcategoryId");
  const isValid =
    form.formState.isValid &&
    form.watch("amount") > 0 &&
    subcategoryId !== null &&
    subcategoryId > 0;

  return {
    form,
    mutation,
    onSubmit,
    isValid,
    isLoading: mutation.isPending,
  };
}

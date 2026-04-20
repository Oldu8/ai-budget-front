import { startOfDay } from 'date-fns';
import { z } from 'zod';

import type { RecurringExpense } from '@/features/recurring-expenses/types';

export const recurringExpenseSchema = z
  .object({
    amount: z
      .number()
      .min(0.01, 'Amount must be greater than 0')
      .max(1_000_000, 'Amount is too large'),
    subcategoryId: z.union([z.null(), z.number()]),
    startsAt: z.date(),
    frequency: z.enum(['weekly', 'monthly', 'yearly']),
    endsAt: z.date().nullable(),
    hasEndDate: z.boolean(),
    label: z.union([z.string().max(255), z.null()]),
  })
  .refine((data) => data.subcategoryId !== null && data.subcategoryId > 0, {
    message: 'Subcategory is required',
    path: ['subcategoryId'],
  })
  .refine(
    (data) =>
      !data.hasEndDate ||
      (data.endsAt !== null &&
        !Number.isNaN(data.endsAt.getTime()) &&
        startOfDay(data.endsAt).getTime() >= startOfDay(data.startsAt).getTime()),
    {
      message: 'End date must be on or after start date',
      path: ['endsAt'],
    }
  )
  .refine(
    (data) =>
      !data.hasEndDate ||
      (data.endsAt !== null && !Number.isNaN(data.endsAt.getTime())),
    {
      message: 'End date is required when enabled',
      path: ['endsAt'],
    }
  );

export type RecurringExpenseFormData = z.infer<typeof recurringExpenseSchema>;

export function getDefaultRecurringExpenseFormValues(): RecurringExpenseFormData {
  return {
    amount: 0,
    subcategoryId: null,
    startsAt: startOfDay(new Date()),
    frequency: 'monthly',
    endsAt: null,
    hasEndDate: false,
    label: null,
  };
}

export function recurringExpenseToFormData(
  expense: RecurringExpense
): RecurringExpenseFormData {
  const startsAt = new Date(expense.starts_at);
  const endsAt =
    expense.ends_at && expense.ends_at.length > 0
      ? new Date(expense.ends_at)
      : null;
  return {
    amount: expense.amount / 100,
    subcategoryId: expense.category_id,
    startsAt: startOfDay(
      Number.isNaN(startsAt.getTime()) ? new Date() : startsAt
    ),
    frequency: expense.frequency,
    endsAt:
      endsAt && !Number.isNaN(endsAt.getTime()) ? startOfDay(endsAt) : null,
    hasEndDate: Boolean(
      expense.ends_at && expense.ends_at.length > 0 && endsAt
    ),
    label: expense.label,
  };
}

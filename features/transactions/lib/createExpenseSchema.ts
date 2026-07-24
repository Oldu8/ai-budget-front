import { startOfDay } from 'date-fns';
import { z } from 'zod';

export const createExpenseSchema = z
  .object({
    amount: z
      .number()
      .min(0.01, 'Amount must be greater than 0')
      .max(1_000_000, 'Amount is too large'),
    label: z.union([z.string().max(255), z.null()]),
    /** Default `null` in the form; submit is blocked until a subcategory is chosen. */
    subcategoryId: z.union([z.null(), z.number()]),
    /** Local calendar day; default today in the form. */
    date: z.date('Date is required'),
  })
  .refine((data) => data.subcategoryId !== null && data.subcategoryId > 0, {
    message: 'Subcategory is required',
    path: ['subcategoryId'],
  })
  .refine(
    (data) =>
      startOfDay(data.date).getTime() <= startOfDay(new Date()).getTime(),
    {
      message: 'Date cannot be in the future',
      path: ['date'],
    }
  );

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

export function getDefaultExpenseFormValues(): CreateExpenseFormData {
  return {
    amount: 0,
    label: null,
    subcategoryId: null,
    date: startOfDay(new Date()),
  };
}

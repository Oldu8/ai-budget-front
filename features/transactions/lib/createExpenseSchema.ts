import { z } from 'zod';

export const createExpenseSchema = z
  .object({
    amount: z
      .number()
      .min(0.01, 'Amount must be greater than 0')
      .max(1_000_000, 'Amount is too large'),
    /** Default `null` in the form; submit is blocked until a subcategory is chosen. */
    subcategoryId: z.union([z.null(), z.number()]),
  })
  .refine((data) => data.subcategoryId !== null && data.subcategoryId > 0, {
    message: 'Subcategory is required',
    path: ['subcategoryId'],
  });

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

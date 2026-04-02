import type { TFunction } from 'i18next';
import { z } from 'zod';

/** Letters, numbers, spaces, and common punctuation for short product names. */
const LABEL_ALLOWED = /^[\p{L}\p{N}\s\-.,'"/&()]+$/u;

export function createReceiptItemEditSchema(t: TFunction) {
  return z
    .object({
      label: z
        .string()
        .trim()
        .min(1, t('add.receiptScan.validation.labelRequired'))
        .max(120, t('add.receiptScan.validation.labelTooLong'))
        .refine((s) => /[\p{L}]/u.test(s), {
          message: t('add.receiptScan.validation.labelNeedsLetters'),
        })
        .refine((s) => LABEL_ALLOWED.test(s), {
          message: t('add.receiptScan.validation.labelInvalidChars'),
        }),
      amount: z
        .number()
        .min(0.01, t('add.receiptScan.validation.amountMin'))
        .max(1_000_000, t('add.receiptScan.validation.amountMax')),
      subcategoryId: z.union([z.null(), z.number()]),
    })
    .refine((data) => data.subcategoryId !== null && data.subcategoryId > 0, {
      message: t('add.receiptScan.validation.subcategoryRequired'),
      path: ['subcategoryId'],
    });
}

export type ReceiptItemEditFormData = z.infer<
  ReturnType<typeof createReceiptItemEditSchema>
>;

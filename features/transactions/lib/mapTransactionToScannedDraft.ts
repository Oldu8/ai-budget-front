import { mapScannedDraft } from '@/features/receipt-scan/lib/mapScannedDraft';
import type { ScannedDraft } from '@/features/receipt-scan/model/types';
import type { TransactionDetail } from '@/features/transactions/types';

/** Wraps GET /transactions/{id} for mapScannedDraft (same resource shape as scan). */
export function mapTransactionDetailToScannedDraft(
  detail: TransactionDetail
): ScannedDraft {
  return mapScannedDraft({
    data: {
      id: detail.id,
      date: detail.date,
      total_amount: detail.total_amount,
      created_by: detail.created_by,
      confirmed_at: detail.confirmed_at,
      img_path: detail.img_path,
      raw_ai_data: undefined,
      original_currency: detail.original_currency,
      original_total_amount: detail.original_total_amount,
      exchange_rate: detail.exchange_rate,
      rate_is_approximate: detail.rate_is_approximate,
      items: detail.items.map((i) => ({
        id: i.id,
        label: i.label ?? '',
        amount: i.amount,
        category_id: i.category_id,
        category: i.category
          ? {
              id: i.category.id,
              name: i.category.name,
              label: i.category.label,
            }
          : null,
      })),
    },
  });
}

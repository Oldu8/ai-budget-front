import { protectedGet } from '@/shared/api/protectedClient';
import type { SubcategorySummaryResponse } from '@/features/home/types';

export async function getSubcategorySummary(
  categoryId: number,
  from: string,
  to: string
): Promise<SubcategorySummaryResponse> {
  const response = await protectedGet<SubcategorySummaryResponse>(
    `/api/transactions/summary/${categoryId}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  return {
    days: response.days ?? {},
    meta: response.meta,
  };
}

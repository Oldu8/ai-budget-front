import { protectedGet } from '@/shared/api/protectedClient';
import type { MonthlySummaryResponse } from '@/features/home/types';

export async function getMonthlySummary(
  from: string,
  to: string
): Promise<MonthlySummaryResponse> {
  const response = await protectedGet<MonthlySummaryResponse>(
    `/api/transactions/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  return {
    days: response.days ?? {},
    meta: response.meta,
  };
}

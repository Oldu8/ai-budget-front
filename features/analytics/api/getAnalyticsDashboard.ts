import { AnalyticsDashboardResponse } from '@/features/analytics/model/types';
import { protectedGet } from '@/shared/api/protectedClient';

export function getAnalyticsDashboard(
  month: string
): Promise<AnalyticsDashboardResponse> {
  return protectedGet<AnalyticsDashboardResponse>(
    `/api/analytics/dashboard?month=${encodeURIComponent(month)}`
  );
}

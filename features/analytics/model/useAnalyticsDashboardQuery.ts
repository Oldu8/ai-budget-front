import { useQuery } from '@tanstack/react-query';

import { getAnalyticsDashboard } from '@/features/analytics/api/getAnalyticsDashboard';

export function useAnalyticsDashboardQuery(month: string, enabled: boolean) {
  return useQuery({
    queryKey: ['analytics', 'dashboard', month],
    queryFn: () => getAnalyticsDashboard(month),
    enabled,
    staleTime: 5 * 60 * 1000,
    /** Re-fetch when the screen mounts so data isn’t stuck behind a fresh cache after edits elsewhere. */
    refetchOnMount: 'always',
  });
}

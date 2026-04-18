import { useQuery } from '@tanstack/react-query';

import { getPlans } from '@/features/billing/api/getPlans';
import { useAuthContext } from '@/features/auth/providers/AuthProvider';

/** Full catalog from GET /api/plans (includes Free). Filter Free only in paywall UI if needed. */
export function usePlansQuery() {
  const { status } = useAuthContext();
  return useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: getPlans,
    enabled: status === 'authenticated',
  });
}

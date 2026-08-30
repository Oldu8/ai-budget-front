import { useQuery } from '@tanstack/react-query';

import { getIosPriceStrings, isRevenueCatPlatform } from '@/features/billing/lib/revenueCat';

/**
 * Apple-localized price strings per plan, keyed by PlanType (e.g. { premium: '$9.99' }).
 * iOS-only — off iOS (or in Expo Go) this stays disabled and callers fall back to the
 * backend's price. See getIosPriceStrings() for why this exists.
 *
 * @param enabled Pass `status === 'authenticated'` from the caller — Purchases.configure()
 * only runs once auth resolves (see AuthProvider), so querying before that just fails.
 */
export function useIosPrices(enabled: boolean) {
  return useQuery({
    queryKey: ['billing', 'ios-prices'],
    queryFn: getIosPriceStrings,
    enabled: isRevenueCatPlatform() && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

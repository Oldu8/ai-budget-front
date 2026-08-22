import { useQuery } from '@tanstack/react-query';

import { getIosPriceStrings, isRevenueCatPlatform } from '@/features/billing/lib/revenueCat';

/**
 * Apple-localized price strings per plan, keyed by PlanType (e.g. { premium: '$9.99' }).
 * iOS-only — off iOS (or in Expo Go) this stays disabled and callers fall back to the
 * backend's price. See getIosPriceStrings() for why this exists.
 */
export function useIosPrices() {
  return useQuery({
    queryKey: ['billing', 'ios-prices'],
    queryFn: getIosPriceStrings,
    enabled: isRevenueCatPlatform(),
    staleTime: 5 * 60 * 1000,
  });
}

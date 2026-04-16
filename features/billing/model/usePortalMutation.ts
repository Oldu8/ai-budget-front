import { useMutation } from '@tanstack/react-query';

import { createPortalSession } from '@/features/billing/api/createPortalSession';

export function usePortalMutation() {
  return useMutation({
    mutationFn: createPortalSession,
  });
}

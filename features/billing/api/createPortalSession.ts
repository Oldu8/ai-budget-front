import type { PortalResponse } from '@/features/billing/types';
import { protectedPost } from '@/shared/api/protectedClient';

export async function createPortalSession(): Promise<PortalResponse> {
  return protectedPost<PortalResponse>('/api/stripe/portal');
}

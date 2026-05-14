import { mapScannedDraft } from '@/features/receipt-scan/lib/mapScannedDraft';

/**
 * Voice POST `/api/transactions/voice` returns the same `{ data: Transaction }` AI draft shape
 * as receipt scan — reuse the mapper.
 */
export const mapVoiceDraftTransaction = mapScannedDraft;

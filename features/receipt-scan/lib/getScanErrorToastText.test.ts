import type { TFunction } from 'i18next';

import { ApiError } from '@/shared/api/client';

import { getScanErrorToastText } from './getScanErrorToastText';

const t = ((key: string) => key) as unknown as TFunction;

describe('getScanErrorToastText', () => {
  it('returns the generic key for a non-ApiError error', () => {
    expect(getScanErrorToastText(new Error('boom'), t)).toBe(
      'add.receiptScan.errors.generic',
    );
  });

  it('maps a known backend error code to its i18n key', () => {
    const err = new ApiError('failed', 422, { code: 'ai_quota_exhausted' });
    expect(getScanErrorToastText(err, t)).toBe(
      'add.receiptScan.errors.aiQuotaExhausted',
    );
  });

  it('returns the image validation message for a 422 image error', () => {
    const err = new ApiError('failed', 422, {
      errors: { image: ['Image is too large'] },
    });
    expect(getScanErrorToastText(err, t)).toBe('Image is too large');
  });

  it('returns a meaningful 422 backend message', () => {
    const err = new ApiError('failed', 422, { message: 'Receipt is blurry' });
    expect(getScanErrorToastText(err, t)).toBe('Receipt is blurry');
  });

  it('falls back to the invalidReceipt key for a generic Laravel 422 message', () => {
    const err = new ApiError('failed', 422, {
      message: 'The given data was invalid.',
    });
    expect(getScanErrorToastText(err, t)).toBe(
      'add.receiptScan.errors.invalidReceipt',
    );
  });

  it('falls back to err.message for a 422 with no body at all', () => {
    const err = new ApiError('failed', 422);
    expect(getScanErrorToastText(err, t)).toBe('failed');
  });

  it('returns the aiFailed key for a 503', () => {
    const err = new ApiError('failed', 503);
    expect(getScanErrorToastText(err, t)).toBe('add.receiptScan.errors.aiFailed');
  });

  it('returns the backend message for a 403 when present', () => {
    const err = new ApiError('failed', 403, { message: 'Forbidden reason' });
    expect(getScanErrorToastText(err, t)).toBe('Forbidden reason');
  });

  it('falls back to err.message for a 401 with no body message', () => {
    const err = new ApiError('Unauthorized', 401);
    expect(getScanErrorToastText(err, t)).toBe('Unauthorized');
  });

  it('returns err.message for any other status', () => {
    const err = new ApiError('Server exploded', 500);
    expect(getScanErrorToastText(err, t)).toBe('Server exploded');
  });

  it('falls back to the generic key when err.message is empty', () => {
    const err = new ApiError('', 500);
    expect(getScanErrorToastText(err, t)).toBe('add.receiptScan.errors.generic');
  });
});

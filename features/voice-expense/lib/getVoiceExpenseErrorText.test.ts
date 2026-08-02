import { ApiError } from '@/shared/api/client';

import { getVoiceExpenseErrorPresentation } from './getVoiceExpenseErrorText';

describe('getVoiceExpenseErrorPresentation', () => {
  it('classifies a 403 quota-hint message as a quota upgrade prompt', () => {
    const err = new ApiError('You have reached your scan limit', 403);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'i18n',
      i18nKey: 'error.quota',
      showUpgradeButton: true,
      upgradePaywall: 'quota',
    });
  });

  it('classifies a 403 plan-hint message as a plan upgrade prompt', () => {
    const err = new ApiError('This feature requires a Premium subscription', 403);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'i18n',
      i18nKey: 'error.planRequired',
      showUpgradeButton: true,
      upgradePaywall: 'plan',
    });
  });

  it('defaults an ambiguous 403 message to the plan upgrade prompt', () => {
    const err = new ApiError('Forbidden', 403);
    expect(getVoiceExpenseErrorPresentation(err).kind).toBe('i18n');
    expect(
      (getVoiceExpenseErrorPresentation(err) as { i18nKey: string }).i18nKey,
    ).toBe('error.planRequired');
  });

  it('prefers quota when both quota and plan hints are present', () => {
    const err = new ApiError('Your premium plan quota is exhausted', 403);
    expect(
      (getVoiceExpenseErrorPresentation(err) as { upgradePaywall: string })
        .upgradePaywall,
    ).toBe('quota');
  });

  it('returns a short 422 backend message verbatim', () => {
    const err = new ApiError('Audio was too quiet to transcribe', 422);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'message',
      message: 'Audio was too quiet to transcribe',
    });
  });

  it('falls back to the unreadable key for a long 422 message', () => {
    const err = new ApiError('x'.repeat(240), 422);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'i18n',
      i18nKey: 'error.unreadable',
    });
  });

  it('falls back to the unreadable key for an empty 422 message', () => {
    const err = new ApiError('', 422);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'i18n',
      i18nKey: 'error.unreadable',
    });
  });

  it('returns a short 503 backend message verbatim', () => {
    const err = new ApiError('AI service is warming up', 503);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'message',
      message: 'AI service is warming up',
    });
  });

  it('falls back to the serverError key for a long 503 message', () => {
    const err = new ApiError('x'.repeat(240), 503);
    expect(getVoiceExpenseErrorPresentation(err)).toEqual({
      kind: 'i18n',
      i18nKey: 'error.serverError',
    });
  });

  it('detects a permission/microphone error from a plain Error', () => {
    expect(
      getVoiceExpenseErrorPresentation(new Error('Microphone permission denied')),
    ).toEqual({ kind: 'i18n', i18nKey: 'error.permissionDenied' });
  });

  it('falls back to the generic key for an unrecognized error', () => {
    expect(getVoiceExpenseErrorPresentation(new Error('boom'))).toEqual({
      kind: 'i18n',
      i18nKey: 'error.generic',
    });
    expect(getVoiceExpenseErrorPresentation('not an error')).toEqual({
      kind: 'i18n',
      i18nKey: 'error.generic',
    });
  });

  it('falls back to the generic key for an ApiError with an unhandled status', () => {
    expect(getVoiceExpenseErrorPresentation(new ApiError('boom', 500))).toEqual({
      kind: 'i18n',
      i18nKey: 'error.generic',
    });
  });
});

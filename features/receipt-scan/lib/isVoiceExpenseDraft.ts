/**
 * Backend sets `raw_ai_data.source` to `voice_expense` for Premium voice uploads.
 */
export function isVoiceExpenseDraft(rawAiData: unknown): boolean {
  if (!rawAiData || typeof rawAiData !== 'object') return false;
  const source = (rawAiData as { source?: unknown }).source;
  return source === 'voice_expense' || source === 'voice';
}

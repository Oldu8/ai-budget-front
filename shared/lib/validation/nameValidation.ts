const NAME_REGEX = /^[\p{L}\s\-']+$/u;
const MIN_LENGTH = 2;
const MAX_LENGTH = 50;

export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export interface NameValidationResult {
  valid: boolean;
  error?: string;
}

export function validateName(value: string): NameValidationResult {
  const normalized = normalizeName(value);

  if (normalized.length === 0) {
    return { valid: false, error: 'Required' };
  }
  if (normalized.length < MIN_LENGTH) {
    return { valid: false, error: 'Enter at least 2 characters' };
  }
  if (normalized.length > MAX_LENGTH) {
    return { valid: false, error: 'Maximum 50 characters' };
  }
  if (!NAME_REGEX.test(normalized)) {
    return {
      valid: false,
      error: 'Only letters, spaces, hyphens, and apostrophes are allowed',
    };
  }

  return { valid: true };
}

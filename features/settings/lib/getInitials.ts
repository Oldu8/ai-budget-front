/**
 * Generates initials from first and last name for avatar display.
 * John Doe → "JD", John → "J", empty → "User"
 */
export function getInitials(
  firstName: string | null,
  lastName: string | null
): string {
  const first = (firstName ?? '').trim();
  const last = (lastName ?? '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first[0].toUpperCase();
  if (last) return last[0].toUpperCase();
  return 'User';
}

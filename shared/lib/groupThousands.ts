/** Insert a non-breaking space every 3 digits in the integer part (`1234.56` -> `1 234.56`). */
export function groupThousands(value: string): string {
  const [integerPart, ...rest] = value.split('.');
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return rest.length > 0 ? `${grouped}.${rest.join('.')}` : grouped;
}

import type { SelectItem } from '@/shared/ui/SearchableSelect';

export const TIMEZONE_ITEMS: SelectItem[] = [
  {
    label: 'America/Los_Angeles',
    value: 'America/Los_Angeles',
    badge: 'UTC-08:00',
    keywords: ['los angeles', 'pacific'],
  },
  {
    label: 'America/Denver',
    value: 'America/Denver',
    badge: 'UTC-07:00',
    keywords: ['denver', 'mountain'],
  },
  {
    label: 'America/Chicago',
    value: 'America/Chicago',
    badge: 'UTC-06:00',
    keywords: ['chicago', 'central'],
  },
  {
    label: 'America/Mexico_City',
    value: 'America/Mexico_City',
    badge: 'UTC-06:00',
    keywords: ['mexico'],
  },
  {
    label: 'America/New_York',
    value: 'America/New_York',
    badge: 'UTC-05:00',
    keywords: ['new york', 'eastern'],
  },
  {
    label: 'America/Sao_Paulo',
    value: 'America/Sao_Paulo',
    badge: 'UTC-03:00',
    keywords: ['sao paulo', 'brazil'],
  },
  { label: 'UTC', value: 'UTC', badge: 'UTC+00:00', keywords: ['utc'] },
  {
    label: 'Europe/London',
    value: 'Europe/London',
    badge: 'UTC+00:00',
    keywords: ['london', 'uk'],
  },
  {
    label: 'Europe/Madrid',
    value: 'Europe/Madrid',
    badge: 'UTC+01:00',
    keywords: ['madrid', 'spain'],
  },
  {
    label: 'Europe/Paris',
    value: 'Europe/Paris',
    badge: 'UTC+01:00',
    keywords: ['paris', 'france'],
  },
  {
    label: 'Europe/Berlin',
    value: 'Europe/Berlin',
    badge: 'UTC+01:00',
    keywords: ['berlin', 'germany'],
  },
  {
    label: 'Europe/Warsaw',
    value: 'Europe/Warsaw',
    badge: 'UTC+01:00',
    keywords: ['warsaw', 'poland'],
  },
  {
    label: 'Europe/Kyiv',
    value: 'Europe/Kyiv',
    badge: 'UTC+02:00',
    keywords: ['kyiv', 'kiev', 'ukraine'],
  },
  {
    label: 'Europe/Moscow',
    value: 'Europe/Moscow',
    badge: 'UTC+03:00',
    keywords: ['moscow', 'russia'],
  },
  {
    label: 'Asia/Dubai',
    value: 'Asia/Dubai',
    badge: 'UTC+04:00',
    keywords: ['dubai', 'uae'],
  },
  {
    label: 'Asia/Shanghai',
    value: 'Asia/Shanghai',
    badge: 'UTC+08:00',
    keywords: ['shanghai', 'china'],
  },
  {
    label: 'Asia/Tokyo',
    value: 'Asia/Tokyo',
    badge: 'UTC+09:00',
    keywords: ['tokyo', 'japan'],
  },
  {
    label: 'Australia/Sydney',
    value: 'Australia/Sydney',
    badge: 'UTC+10:00',
    keywords: ['sydney', 'australia'],
  },
];

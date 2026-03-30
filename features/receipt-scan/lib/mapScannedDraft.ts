import type { ScannedDraft, ScannedDraftItem } from '@/features/receipt-scan/model/types';

type RawItem = {
  id?: unknown;
  label?: unknown;
  amount?: unknown;
  category_id?: unknown;
  category?: { id?: unknown; name?: unknown; label?: unknown } | null;
};

type RawCategory = NonNullable<RawItem['category']>;

type RawTransaction = {
  id?: unknown;
  date?: unknown;
  total_amount?: unknown;
  created_by?: unknown;
  confirmed_at?: unknown;
  img_path?: unknown;
  raw_ai_data?: unknown;
  items?: unknown;
};

function num(v: unknown): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function mapItem(raw: RawItem): ScannedDraftItem | null {
  const id = num(raw.id);
  if (id === null) return null;
  const label = str(raw.label);
  const amount = num(raw.amount) ?? 0;
  const cat = raw.category as RawCategory | null | undefined;
  const categoryId =
    num(raw.category_id) ?? (cat ? num(cat.id) : null);
  let categoryLabel: string | null = null;
  if (cat) {
    const n = cat.name != null ? str(cat.name) : '';
    const l = cat.label != null ? str(cat.label) : '';
    categoryLabel = l || n || null;
  }
  return {
    id,
    label,
    amount,
    categoryId,
    categoryLabel,
  };
}

export function mapScannedDraft(payload: unknown): ScannedDraft {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid scan response');
  }
  const root = payload as { data?: RawTransaction };
  const t = root.data;
  if (!t || typeof t !== 'object') {
    throw new Error('Invalid scan response: missing data');
  }

  const id = num(t.id);
  if (id === null) {
    throw new Error('Invalid scan response: missing transaction id');
  }

  const itemsRaw = Array.isArray(t.items) ? t.items : [];
  const items: ScannedDraftItem[] = [];
  for (const row of itemsRaw) {
    if (!row || typeof row !== 'object') continue;
    const mapped = mapItem(row as RawItem);
    if (mapped) items.push(mapped);
  }

  return {
    id,
    date: str(t.date),
    totalAmount: num(t.total_amount) ?? 0,
    createdBy: str(t.created_by),
    confirmedAt:
      t.confirmed_at === null || t.confirmed_at === undefined
        ? null
        : str(t.confirmed_at),
    imgPath:
      t.img_path === null || t.img_path === undefined
        ? null
        : str(t.img_path),
    rawAiData: t.raw_ai_data,
    items,
  };
}

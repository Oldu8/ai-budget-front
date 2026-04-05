import type {
  TransactionDetail,
  TransactionItemDetail,
} from "@/features/transactions/types";
import { protectedGet } from "@/shared/api/protectedClient";

// TODO: use zod to parse the data
function num(v: unknown): number | null {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseCategory(raw: unknown): TransactionItemDetail["category"] {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const id = num(c.id);
  if (id === null) return null;
  return {
    id,
    name: c.name != null ? str(c.name) : undefined,
    label: c.label != null ? str(c.label) : undefined,
  };
}

function parseItem(raw: unknown): TransactionItemDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = num(o.id);
  if (id === null) return null;
  const cat = parseCategory(o.category);
  const category_id = num(o.category_id) ?? (cat ? cat.id : null) ?? undefined;
  return {
    id,
    label: o.label === null || o.label === undefined ? null : str(o.label),
    amount: num(o.amount) ?? 0,
    category_id,
    category: cat,
  };
}

function parseTransactionBody(t: Record<string, unknown>): TransactionDetail {
  const id = num(t.id);
  if (id === null) {
    throw new Error("Invalid transaction: missing id");
  }
  const itemsRaw = Array.isArray(t.items) ? t.items : [];
  const items: TransactionItemDetail[] = [];
  for (const row of itemsRaw) {
    const it = parseItem(row);
    if (it) items.push(it);
  }
  return {
    id,
    date: str(t.date),
    total_amount: num(t.total_amount) ?? 0,
    type: str(t.type) || "expense",
    created_by: str(t.created_by),
    confirmed_at:
      t.confirmed_at === null || t.confirmed_at === undefined
        ? null
        : str(t.confirmed_at),
    img_path:
      t.img_path === null || t.img_path === undefined ? null : str(t.img_path),
    items,
  };
}

export async function getTransaction(
  transactionId: number,
): Promise<TransactionDetail> {
  const json = await protectedGet<unknown>(
    `/api/transactions/${transactionId}`,
  );
  if (!json || typeof json !== "object") {
    throw new Error("Invalid transaction response");
  }
  const root = json as Record<string, unknown>;
  const body =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : (root as Record<string, unknown>);
  return parseTransactionBody(body);
}

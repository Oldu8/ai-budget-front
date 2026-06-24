export type TransactionCategoryRef = {
  id: number;
  name?: string;
  label?: string;
};

export type TransactionItemDetail = {
  id: number;
  label: string | null;
  amount: number;
  category_id?: number;
  category?: TransactionCategoryRef | null;
};

export type TransactionDetail = {
  id: number;
  date: string;
  total_amount: number;
  currency?: string | null;
  original_currency?: string | null;
  original_total_amount?: number | null;
  rate_is_approximate?: boolean;
  type: "expense" | "income" | string;
  created_by: string;
  confirmed_at?: string | null;
  img_path?: string | null;
  items: TransactionItemDetail[];
};

export type TransactionListItem = {
  id: number;
  date: string;
  total_amount: number;
  type: string;
  created_by?: string;
  img_path?: string | null;
  items?: TransactionItemDetail[];
};

export type TransactionsListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type TransactionsListResult = {
  data: TransactionListItem[];
  meta: TransactionsListMeta;
};

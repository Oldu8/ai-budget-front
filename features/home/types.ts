/**
 * Types for the home feature: API responses and table model.
 */

// GET /api/transactions/summary?from&to
export interface MonthlySummaryResponse {
  days: Record<string, Record<string, number>>; // YYYY-MM-DD -> categoryId -> cents
  meta?: {
    totals_by_category?: Record<string, number>;
    grand_total?: number;
  };
}

// GET /api/transactions/summary/{category}?from&to — same shape, keys = subcategory ids
export type SubcategorySummaryResponse = MonthlySummaryResponse;

// Output of buildExpenseTable
export interface TableRow {
  id: number;
  label: string;
  level: 'parent' | 'child';
  categoryId: number;
  categorySlug?: string;
  /** Parent category `name` slug — set on child rows for composite icon lookup (e.g. work vs fitness `equipment`). */
  parentCategorySlug?: string;
  /** day (1-31) -> amount in minor units (cents) */
  amountsByDay: Record<number, number>;
  /** Sum of `amountsByDay` in minor units (cents) */
  total: number;
  /** True for parent rows that have subcategories — cell is clickable to expand/collapse */
  expandable?: boolean;
}

export interface ExpenseTableData {
  days: number[];
  rows: TableRow[];
  /** day (1-31) -> total spent that day in minor units (cents) */
  totalsByDay: Record<number, number>;
  /** Month total in minor units (cents) */
  grandTotal: number;
}

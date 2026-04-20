export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

export type RecurringExpense = {
  id: number;
  category_id: number;
  amount: number;
  label: string | null;
  starts_at: string;
  frequency: RecurringFrequency;
  interval: number;
  ends_at: string | null;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
};

export type CreateRecurringExpensePayload = {
  category_id: number;
  amount: number;
  label?: string | null;
  starts_at: string;
  frequency: RecurringFrequency;
  interval?: number;
  ends_at?: string | null;
};

export type UpdateRecurringExpensePayload = {
  category_id?: number;
  amount?: number;
  label?: string | null;
  starts_at?: string;
  frequency?: RecurringFrequency;
  interval?: number;
  ends_at?: string | null;
};

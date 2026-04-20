import { format } from 'date-fns';

import type { RecurringExpenseFormData } from '@/features/recurring-expenses/lib/recurringExpenseSchema';
import type {
  CreateRecurringExpensePayload,
  UpdateRecurringExpensePayload,
} from '@/features/recurring-expenses/types';

const API_INTERVAL = 1;

export function toCreateRecurringExpensePayload(
  data: RecurringExpenseFormData
): CreateRecurringExpensePayload {
  const subId = data.subcategoryId;
  if (subId == null || subId <= 0) throw new Error('Subcategory is required');
  const labelTrimmed = data.label?.trim();
  return {
    category_id: subId,
    amount: Math.round(data.amount * 100),
    label: labelTrimmed ? labelTrimmed : null,
    starts_at: format(data.startsAt, 'yyyy-MM-dd'),
    frequency: data.frequency,
    interval: API_INTERVAL,
    ends_at:
      data.hasEndDate && data.endsAt
        ? format(data.endsAt, 'yyyy-MM-dd')
        : null,
  };
}

export function toUpdateRecurringExpensePayload(
  data: RecurringExpenseFormData
): UpdateRecurringExpensePayload {
  return toCreateRecurringExpensePayload(data);
}

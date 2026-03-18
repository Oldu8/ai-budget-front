import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { getSubcategorySummary } from '@/features/home/api/getSubcategorySummary';

export function useSubcategorySummaryQuery(
  categoryId: number,
  year: number,
  month: number,
  enabled: boolean,
) {
  const date = new Date(year, month - 1);
  const from = format(startOfMonth(date), "yyyy-MM-dd");
  const to = format(endOfMonth(date), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["home", "subcategory-summary", categoryId, from, to],
    queryFn: () => getSubcategorySummary(categoryId, from, to),
    enabled,
  });
}

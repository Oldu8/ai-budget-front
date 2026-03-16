import type { Category } from "@/entities/category";
import { getMonthDays } from "@/features/home/lib/getMonthDays";
import type {
  ExpenseTableData,
  MonthlySummaryResponse,
  SubcategorySummaryResponse,
  TableRow,
} from "@/features/home/types";

function formatDateKey(year: number, month: number, day: number): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

function sumAmounts(amountsByDay: Record<number, number>): number {
  return Object.values(amountsByDay).reduce((sum, v) => sum + v, 0);
}

export function buildExpenseTable(
  categories: Category[],
  monthlySummary: MonthlySummaryResponse | null,
  subcategorySummaries: Map<number, SubcategorySummaryResponse>,
  expandedIds: Set<number>,
  year: number,
  month: number,
): ExpenseTableData {
  const days = getMonthDays(year, month);
  const daysObj = days.reduce(
    (acc, d) => ({ ...acc, [d]: 0 }),
    {} as Record<number, number>,
  );
  const totalsByDay = { ...daysObj };
  let grandTotal = 0;

  const parentCategories = categories.filter((c) => c.category_id == null);

  const rows: TableRow[] = [];
  // TODO: do we cash this ?
  for (const parent of parentCategories) {
    const parentData = monthlySummary?.days ?? {};
    const parentAmountsByDay: Record<number, number> = {};
    for (const day of days) {
      const dateKey = formatDateKey(year, month, day);
      const dayData = parentData[dateKey];
      if (dayData && typeof dayData === "object") {
        const cents = dayData[String(parent.id)] ?? 0;
        if (cents > 0) {
          parentAmountsByDay[day] = cents / 100;
          totalsByDay[day] = (totalsByDay[day] ?? 0) + cents / 100;
        }
      }
    }
    const parentTotal = sumAmounts(parentAmountsByDay);
    grandTotal += parentTotal;

    const hasSubcategories = (parent.children?.length ?? 0) > 0;

    rows.push({
      id: parent.id,
      label: parent.label,
      level: "parent",
      categoryId: parent.id,
      categorySlug: parent.name,
      amountsByDay: parentAmountsByDay,
      total: parentTotal,
      expandable: hasSubcategories,
    });

    if (expandedIds.has(parent.id) && hasSubcategories) {
      const subSummary = subcategorySummaries.get(parent.id);
      const subDays = subSummary?.days ?? {};

      for (const child of parent.children!) {
        const childAmountsByDay: Record<number, number> = {};
        for (const day of days) {
          const dateKey = formatDateKey(year, month, day);
          const dayData = subDays[dateKey];
          if (dayData && typeof dayData === "object") {
            const cents = dayData[String(child.id)];
            if (cents != null && cents > 0) {
              childAmountsByDay[day] = cents / 100;
            }
          }
        }
        const childTotal = sumAmounts(childAmountsByDay);

        rows.push({
          id: child.id,
          label: child.label,
          level: "child",
          categoryId: child.id,
          categorySlug: child.name,
          amountsByDay: childAmountsByDay,
          total: childTotal,
        });
      }
    }
  }

  grandTotal = Object.values(totalsByDay).reduce((sum, v) => sum + v, 0);

  return {
    days,
    rows,
    totalsByDay,
    grandTotal,
  };
}

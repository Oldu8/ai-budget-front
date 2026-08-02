import type { Category } from '@/entities/category';

import { buildExpenseTable } from './buildExpenseTable';
import type { MonthlySummaryResponse, SubcategorySummaryResponse } from '../types';

const YEAR = 2026;
const MONTH = 3; // March, 31 days

function categories(): Category[] {
  return [
    {
      id: 1,
      name: 'groceries',
      label: 'Groceries',
      children: [{ id: 11, name: 'groceries_meat', label: 'Meat' }],
    },
    { id: 2, name: 'housing', label: 'Housing' },
  ];
}

function monthlySummary(): MonthlySummaryResponse {
  return {
    days: {
      '2026-03-01': { '1': 500, '2': 200 },
      '2026-03-02': { '1': 300 },
    },
  };
}

describe('buildExpenseTable', () => {
  it('returns all days of the month with zeroed totals when there is no data', () => {
    const result = buildExpenseTable(
      categories(),
      null,
      new Map(),
      new Set(),
      YEAR,
      MONTH,
    );
    expect(result.days).toHaveLength(31);
    expect(result.grandTotal).toBe(0);
    expect(Object.values(result.totalsByDay).every((v) => v === 0)).toBe(
      true,
    );
  });

  it('builds a parent row per category with per-day amounts and a total', () => {
    const result = buildExpenseTable(
      categories(),
      monthlySummary(),
      new Map(),
      new Set(),
      YEAR,
      MONTH,
    );
    const groceriesRow = result.rows.find((r) => r.id === 1);
    expect(groceriesRow).toMatchObject({
      level: 'parent',
      categorySlug: 'groceries',
      amountsByDay: { 1: 500, 2: 300 },
      total: 800,
      expandable: true,
    });

    const housingRow = result.rows.find((r) => r.id === 2);
    expect(housingRow).toMatchObject({
      level: 'parent',
      amountsByDay: { 1: 200 },
      total: 200,
      expandable: false,
    });
  });

  it('does not emit child rows when the parent is not expanded', () => {
    const result = buildExpenseTable(
      categories(),
      monthlySummary(),
      new Map(),
      new Set(),
      YEAR,
      MONTH,
    );
    expect(result.rows.some((r) => r.level === 'child')).toBe(false);
    expect(result.rows).toHaveLength(2);
  });

  it('emits child rows with their own amounts when the parent is expanded', () => {
    const subSummaries = new Map<number, SubcategorySummaryResponse>([
      [1, { days: { '2026-03-01': { '11': 150 } } }],
    ]);
    const result = buildExpenseTable(
      categories(),
      monthlySummary(),
      subSummaries,
      new Set([1]),
      YEAR,
      MONTH,
    );
    const childRow = result.rows.find((r) => r.id === 11);
    expect(childRow).toMatchObject({
      level: 'child',
      categorySlug: 'groceries_meat',
      parentCategorySlug: 'groceries',
      amountsByDay: { 1: 150 },
      total: 150,
    });
  });

  it('emits a zeroed child row when no subcategory summary is available for an expanded parent', () => {
    const result = buildExpenseTable(
      categories(),
      monthlySummary(),
      new Map(),
      new Set([1]),
      YEAR,
      MONTH,
    );
    const childRow = result.rows.find((r) => r.id === 11);
    expect(childRow).toMatchObject({ amountsByDay: {}, total: 0 });
  });

  it('ignores zero and negative cent values', () => {
    const summary: MonthlySummaryResponse = {
      days: { '2026-03-01': { '1': 0, '2': -50 } },
    };
    const result = buildExpenseTable(
      categories(),
      summary,
      new Map(),
      new Set(),
      YEAR,
      MONTH,
    );
    const groceriesRow = result.rows.find((r) => r.id === 1);
    const housingRow = result.rows.find((r) => r.id === 2);
    expect(groceriesRow?.amountsByDay).toEqual({});
    expect(housingRow?.amountsByDay).toEqual({});
  });

  it('sums per-day totals across all categories into totalsByDay and grandTotal', () => {
    const result = buildExpenseTable(
      categories(),
      monthlySummary(),
      new Map(),
      new Set(),
      YEAR,
      MONTH,
    );
    expect(result.totalsByDay[1]).toBe(700);
    expect(result.totalsByDay[2]).toBe(300);
    expect(result.grandTotal).toBe(1000);
  });
});

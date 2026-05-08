export type AnalyticsDirection = 'up' | 'down' | 'flat';

export type AnalyticsDiff = {
  difference_amount: number;
  difference_percent: number | null;
  direction: AnalyticsDirection;
};

export type AnalyticsSubcategory = {
  id: number;
  slug: string;
  label: string;
  amount: number;
  percent: number;
  bar_percent: number;
  previous_amount: number;
  difference_amount: number;
  difference_percent: number | null;
  direction: AnalyticsDirection;
};

export type AnalyticsCategory = {
  id: number;
  slug: string;
  label: string;
  amount: number;
  percent: number;
  bar_percent: number;
  previous_amount: number;
  difference_amount: number;
  difference_percent: number | null;
  direction: AnalyticsDirection;
  subcategories: AnalyticsSubcategory[];
};

export type AnalyticsTrendCategory = {
  id: number;
  slug: string;
  label: string;
  difference_amount: number;
  difference_percent: number | null;
  direction: AnalyticsDirection;
};

export type AnalyticsTrendSubcategory = AnalyticsTrendCategory;

export type AnalyticsDashboardResponse = {
  month: string;
  currency: string;
  period: {
    from: string;
    to: string;
    previous_from: string;
    previous_to: string;
  };
  overview: {
    total_spent: number;
    previous_month_total: number;
    difference_amount: number;
    difference_percent: number | null;
    direction: AnalyticsDirection;
    average_per_day: number;
    biggest_category: null | {
      id: number;
      slug: string;
      label: string;
      amount: number;
      percent: number;
    };
  };
  categories: AnalyticsCategory[];
  trends: {
    categories: AnalyticsTrendCategory[];
    subcategories: AnalyticsTrendSubcategory[];
  };
};

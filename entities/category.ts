/**
 * Domain entity types for categories, aligned with backend API.
 */

/**
 * Category tree node from GET /api/categories.
 * The response root contains only Level-1 parents; subcategories live in `children`,
 * so the nesting itself encodes the level (no `category_id`/`visibility_tag` needed here).
 */
export interface Category {
  id: number;
  name: string;
  label: string;
  children?: Category[];
}

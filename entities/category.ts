/**
 * Domain entity types for categories, aligned with backend API.
 */

export interface Category {
  id: number;
  category_id: number | null; // null = Level 1 (parent)
  name: string;
  label: string;
  visibility_tag: string | null;
  children?: Category[];
}

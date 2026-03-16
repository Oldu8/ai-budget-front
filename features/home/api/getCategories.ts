import type { Category } from "@/entities/category";
import { protectedGet } from "@/shared/api/protectedClient";

type CategoriesResponse =
  | { data: Category[] }
  | { categories?: Category[] }
  | Category[];

function normalizeCategory(raw: Record<string, unknown>): Category {
  const children = raw.children as Record<string, unknown>[] | undefined;
  return {
    id: Number(raw.id),
    category_id: raw.category_id != null ? Number(raw.category_id) : null,
    name: String(raw.name ?? raw.slug ?? ""),
    label: String(raw.label ?? raw.name ?? ""),
    visibility_tag:
      raw.visibility_tag != null ? String(raw.visibility_tag) : null,
    children: Array.isArray(children)
      ? children.map((c) => normalizeCategory(c as Record<string, unknown>))
      : undefined,
  };
}

function normalizeCategories(response: CategoriesResponse): Category[] {
  let items: Record<string, unknown>[] = [];
  if (Array.isArray(response)) {
    items = response as unknown as Record<string, unknown>[];
  } else if ("data" in response && Array.isArray(response.data)) {
    items = response.data as unknown as Record<string, unknown>[];
  } else if ("categories" in response && Array.isArray(response.categories)) {
    items = response.categories as unknown as Record<string, unknown>[];
  }
  return items.map((item) => normalizeCategory(item));
}

// TODO: why we do need this ? Maybe we need to fix it on the backend side.
export async function getCategories(): Promise<Category[]> {
  const response = await protectedGet<CategoriesResponse>("/api/categories");
  return normalizeCategories(response);
}

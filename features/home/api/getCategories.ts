import type { Category } from "@/entities/category";
import { protectedGet } from "@/shared/api/protectedClient";

export async function getCategories(): Promise<Category[]> {
  const response = await protectedGet<{ data: Category[] }>("/api/categories");
  return response.data ?? [];
}

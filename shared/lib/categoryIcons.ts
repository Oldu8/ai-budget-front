import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";

export type CategoryMaterialIconName = ComponentProps<
  typeof MaterialIcons
>["name"];

/** Normalizes API `name` / slug for lookup (lowercase, spaces and hyphens → underscores). */
export function normalizeCategorySlug(slug: string): string {
  return slug.toLowerCase().replace(/[\s-]+/g, "_");
}

/**
 * Parent category slugs (Level 1) → Material Icons name.
 * Aligns with product icon list (Outlined / 24px optical).
 */
export const MAIN_CATEGORY_ICONS: Record<string, CategoryMaterialIconName> = {
  groceries: "local-grocery-store",
  housing: "domain",
  transport: "directions-bus",
  car: "directions-car",
  health: "medical-services",
  leisure: "celebration",
  shopping: "shopping-bag",
  kids: "child-care",
  pets: "pets",
  beauty: "content-cut",
  connectivity: "router",
  subscriptions: "subscriptions",
  work: "work",
  gifts: "redeem",
  smoking: "smoking-rooms",
  finance: "account-balance",
};

/**
 * Subcategory slugs (Level 2) → Material Icons name.
 * Keys are the full category `name` values from the API (see database/data/categories.php).
 * `*_other` subcategories intentionally fall back to `DEFAULT_ICON`.
 */
export const SUBCATEGORY_ICONS: Record<string, CategoryMaterialIconName> = {
  // Groceries
  groceries_meat: "kebab-dining",
  groceries_fish: "set-meal",
  groceries_vegetables: "eco",
  groceries_fruits: "emoji-nature",
  groceries_dairy: "egg",
  groceries_bakery: "bakery-dining",
  groceries_pantry: "kitchen",
  groceries_sweets: "cake",
  groceries_drinks: "local-drink",
  // Housing
  housing_rent: "key",
  housing_utilities: "bolt",
  housing_furniture: "chair",
  housing_repairs: "handyman",
  housing_household: "cleaning-services",
  // Transport
  transport_taxi: "local-taxi",
  transport_public: "train",
  transport_flights: "flight",
  transport_trains: "directions-railway",
  // Car
  car_fuel: "local-gas-station",
  car_parking: "local-parking",
  car_service: "build",
  car_wash: "local-car-wash",
  // Health
  health_medicines: "medication",
  health_treatment_tests: "biotech",
  // dentistry glyph missing in Material Icons set — use healing (medical)
  health_dental: "healing",
  // Leisure
  leisure_food_delivery: "delivery-dining",
  leisure_entertainment: "theater-comedy",
  leisure_travel: "travel-explore",
  leisure_hobbies: "palette",
  leisure_fitness: "fitness-center",
  // Shopping
  shopping_clothes: "checkroom",
  shopping_shoes: "ice-skating",
  shopping_electronics: "devices",
  shopping_tools: "construction",
  // Kids
  kids_clothes: "checkroom",
  kids_toys: "smart-toy",
  kids_food: "baby-changing-station",
  kids_care: "soap",
  // Pets
  pets_food: "restaurant",
  pets_vet: "health-and-safety",
  pets_supplies: "shopping-bag",
  // Beauty
  beauty_cosmetics: "brush",
  beauty_salon: "face",
  // Connectivity
  connectivity_mobile: "smartphone",
  connectivity_internet: "wifi",
  // Subscriptions
  subscriptions_services: "apps",
  // Work
  work_education: "school",
  work_equipment: "laptop-mac",
  // Gifts
  gifts_close: "favorite",
  gifts_work: "badge",
  // Smoking
  smoking_cigarettes: "smoke-free",
  smoking_vape: "vape-free",
  // Finance
  finance_taxes: "description",
  finance_insurance: "assured-workload",
  finance_loans: "credit-score",
  finance_mortgage: "home-work",
  finance_fees: "payments",
  finance_charity: "volunteer-activism",
};

const DEFAULT_ICON: CategoryMaterialIconName = "more-horiz";

/**
 * Resolves Material Icons glyph name for a category row.
 * Parent rows use `MAIN_CATEGORY_ICONS`; child rows use `SUBCATEGORY_ICONS`.
 */
export function getCategoryMaterialIconName(
  categoryName: string,
  level: "parent" | "child",
): CategoryMaterialIconName {
  const n = normalizeCategorySlug(categoryName);
  if (level === "child") {
    return SUBCATEGORY_ICONS[n] ?? DEFAULT_ICON;
  }
  return MAIN_CATEGORY_ICONS[n] ?? DEFAULT_ICON;
}

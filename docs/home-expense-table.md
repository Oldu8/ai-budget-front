# Home expense table — behavior and UX

This document describes how the **monthly expense table** on the Home tab is intended to work, aligned with the Stitch screen **“Home Overview with Upgrade CTA”** (project `10486232631825462840`, screen id `cf1911204aef453cb991e49556160b4b`) and product requirements discussed in design.

## Data and logic (out of scope for UI-only changes)

- Table rows and amounts come from existing hooks and builders (`useMonthlyExpenseTable`, `buildExpenseTable`, category/subcategory API). **Do not change** that pipeline unless a bug fix requires a minimal touch.
- **Multi-expand:** Any parent category that has subcategories can be expanded; **several** parents may be expanded at once (`expandedIds` is a `Set`).
- **Collapse all:** The toolbar **Collapse** control clears all expansions. There is **no** “expand all” action.

## Toolbar (above the table)

- **Refresh** — runs the same refresh as before (table data + user/session via `refetchMe`). While refreshing:
  - Refresh is **disabled**.
  - A **semi-transparent overlay** covers **only the table card** (not the full screen), with a **spinner** centered on it.
  - The table is **not interactive** until refresh finishes.
- **Collapse** — collapses every expanded subcategory block. **Disabled** when nothing is expanded.
- **Pull-to-refresh** on the table (or the main screen content in the loaded state) is **not** used; refresh is explicit via the toolbar.

## Sticky scrolling (2D grid)

- **Header row (dates):** When the user scrolls **vertically**, the row with weekday letters and day numbers stays **fixed** at the top of the table area.
- **First column (categories):** When the user scrolls **horizontally**, the column with category / subcategory labels stays **fixed** on the left.
- Implementation follows the usual **four-quadrant** pattern: frozen corner + synced horizontal header + synced vertical first column + scrollable body.

## Visual design (Stitch-aligned)

- **Palette:** Brand primary `#005451`, greys and white from `shared/constants/theme` / Tailwind `brand.*`.
- **Table container:** Rounded card (~16px), light border, grey-low style background as in design.
- **Header cells:** White background; small **weekday letter** above **day number** (number in primary, bold).
- **Total column header:** Slightly stronger background; “Total” + month abbreviation.
- **Row dividers:** Hairline borders using grey-hover.
- **Parent rows:** Icon + label; icon uses the **Material Icons** mapping in `shared/lib/categoryIcons.ts` (`CategoryIcon`).
- **Subcategory rows:** Indented label; **no** category icon on the child row (Stitch-style).
- **Expanded parent row:** Whole row (label + amount cells) uses a **primary tint** background (~8% opacity) and **primary** emphasis on amounts/labels as implemented.

## Amount cells (fixed layout)

- **No dots** next to amounts in filled cells.
- **Fixed widths:** Day columns and total column use **fixed pixel widths** so the grid **never** grows when values are large.
- **Truncation:** Long numeric strings are **crudely clipped** (character cap + single line / clip). This is **temporary** until a proper abbreviation formatter (e.g. `1.2k`) exists.

## Totals row (“Daily total”)

- **Background:** Primary (`Colors.primary`).
- **Text:** White; label uses the **Daily total** copy (i18n `home.tableDailyTotal`).
- **Grand total column:** May use a subtle visual separation (e.g. border / tint) vs day cells while staying on-brand.

## Month switcher (top of Home)

- Centered layout with a small uppercase caption (**Performance view**, i18n `home.performanceView`).
- **Single title line:** Full month + year (e.g. “October 2023”), large and bold, primary color.
- **Chevrons:** Rounded-square buttons on light grey, primary chevron icons.
- Behavior unchanged: previous / next month only.

## Paywall CTA (below the table)

- Shown only for users who are **not** on a paid plan (`subscription` missing or `PlanType.Free`).
- Compact **Upgrade** promo (title, subtitle, CTA) opens the existing **`PaywallSheet`** (plan list / checkout), not a new flow.
- Spacing between table and card matches the design intent (padding under the table).

## Category icons

- Icons are **Material Icons** names (Expo `@expo/vector-icons`), normalized from snake_case to kebab-case in `CategoryIcon`.
- **Parents** resolve via `MAIN_CATEGORY_ICONS`; **subcategories** via `SUBCATEGORY_ICONS`. Both maps are keyed by the full category `name` from the API (e.g. `groceries_meat`), which is unique across parents.
- Unknown slugs (including all `*_other`) fall back to **`more_horiz`**.
- Some glyphs from the product list are **substituted** where the Material set has no match (e.g. dental → `healing`); see comments in `shared/lib/categoryIcons.ts`.

## Related files (reference)

| Area | Location |
|------|----------|
| Screen composition | `app/(tabs)/index.tsx` |
| Month switcher | `features/home/ui/MonthSwitcher.tsx` |
| Toolbar | `features/home/ui/ExpenseTableToolbar.tsx` |
| Table layout + overlay + totals | `features/home/ui/ExpenseMonthTable.tsx` |
| Row label / cells | `features/home/ui/ExpenseTableRow.tsx` |
| Header pieces | `features/home/ui/ExpenseTableHeader.tsx` |
| Cell sizing / truncation | `features/home/ui/ExpenseTableCell.tsx` |
| Layout constants | `features/home/ui/expenseTableConstants.ts` |
| Expansion state | `features/home/model/homeStore.ts` |
| Icon map | `shared/lib/categoryIcons.ts` |
| Icon component | `shared/ui/CategoryIcon.tsx` |
| Strings | `shared/i18n/locales/*.ts` (`home.*`) |

## Out of scope (explicitly not in this table UX)

- **Monthly Achievement** card from Stitch (below upgrade banner) — omitted per product choice; can be added later.
- Replacing crude amount truncation with smart formatting — **future** task.

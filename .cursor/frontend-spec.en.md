# AI Budget — Frontend Specification

Concise overview of the Expo / React Native client. For HTTP contracts and payloads, see `frontend-backend-spec.en.md` and `.cursor/api-routes.json`.

---

## 1. Product

Personal budget app (iOS, Android, Web): email/password auth, manual expenses, AI receipt scan (partial), category visibility funnel, monthly expense summaries on Home. CSV export and Stripe billing are backend-ready but not yet integrated in the UI.

**Implemented vs not done** (tracks the `ai-budget-front` repo):

| Area | Done | Not done |
| --- | --- | --- |
| Auth | Login, signup, token refresh, protected API client, logout | — |
| Onboarding | Funnel: settings → visibility questions → tabs | — |
| Profile | Header, edit name; currency / language / timezone pickers on `app/(tabs)/profile.tsx` | Surface `scan_usage` from `GET /api/me` (data is already loaded in auth state) |
| Profile stack | `edit-profile`, `visibility-preferences`, placeholders: `payment-plan`, `export-data`, `notifications` | Stripe customer portal, CSV download, real notifications |
| Home | Month switcher, daily expense grid, expand → subcategories, loading/empty/error | Optional: charts, non-month ranges, standalone analytics screen |
| Add tab | **Receipt scan** (primary): pick image → `POST /api/transactions/scan` → `/(add)/scan-review` (placeholder review) | Full review: edit lines, confirm via `PUT /api/transactions/{id}/update`, receipt image via `GET .../image` |
| Add tab | Manual expense `/(add)/manual` | — |
| Transactions API | `POST /api/transactions` expense only | `GET`/`PUT`/`DELETE` list & edit, income type |
| Data | Summary + subcategory APIs on Home; `GET /api/categories` (`features/home/api/`, `entities/category.ts`, `shared/lib/categoryIcons.ts`) | — |
| Receipt scan feature | `features/receipt-scan/`: multipart scan, draft store, error toasts, `ReceiptSourceSheet`, `mapScannedDraft` (expects `{ data: { ... } }`) | Confirm flow, signed image preview, structured editor |
| Billing / CSV | — | Export UI (`GET /api/transactions/export`), Stripe |

---

## 2. Tech stack

| Layer | Packages |
| --- | --- |
| UI | React 19.1, React Native 0.81, Expo SDK ~54, expo-router |
| Nav | @react-navigation/native, bottom-tabs, elements |
| Style | NativeWind 4, tailwindcss, `global.css`; light theme only |
| Server state | @tanstack/react-query (persist packages present; root uses in-memory `QueryClient` in `app/_layout.tsx`) |
| Client state | Zustand |
| Forms | react-hook-form, zod, @hookform/resolvers |
| i18n | i18next, react-i18next — `en`, `es`, `uk` under `shared/i18n/locales/` |
| Tokens | expo-secure-store (native), Async Storage (web) — `shared/storage/tokenStorage.ts` |
| HTTP | `shared/api/client.ts`, `protectedClient.ts` (Bearer, optional `X-API-Key` from `EXPO_PUBLIC_API_SECRET`, 401 → refresh once → logout) |
| Other | date-fns, clsx; expo-image-picker, Reanimated, MMKV, datetime picker — see `package.json` |

---

## 3. Architecture

**Feature-first** (details: `.cursor/rules/feature-first-architecture.mdc`). Top-level:

- **`app/`** — layouts, route groups; screens stay thin and compose features.
- **`shared/`** — API, UI kit, i18n, theme, env, storage helpers.
- **`entities/`** — shared types (e.g. `user.ts`, `category.ts`).
- **`features/`** — `auth`, `funnel`, `settings`, `home`, `transactions`, **`receipt-scan`** (`api/`, `model/`, `ui/`, `lib/` as needed).

There is no separate `screens/` folder; routes live under `app/`.

**Env:** `EXPO_PUBLIC_*`; `shared/constants/env.ts` (`apiUrl`, `appEnv`, `apiSecret` for optional API key on all requests).

---

## 4. Auth

- **`AuthProvider`** (`features/auth/providers/AuthProvider.tsx`): `bootstrapAuth` on mount; unauthenticated → `/(auth)/login`; authenticated in auth group → `/(tabs)` or `/(funnel)/settings` if no settings; authenticated on tabs without settings → `/(funnel)/settings`. Visibility step is reached via funnel navigation after settings, not as an extra redirect rule in `AuthProvider`.
- **`useAuthContext()`** (from `useAuth`): `signIn`, `signUp`, `signOut`, `bootstrapAuth`, `refetchMe`, `user`, `settings`, `subscription`, `scanUsage`, `status`, `error`, `setError`.

---

## 5. Navigation (expo-router)

| Group | Role |
| --- | --- |
| `app/(tabs)/` | Home, Add (scan + link to manual), Profile |
| `app/(auth)/` | login, signup |
| `app/(funnel)/` | settings, visibility-questions |
| `app/(profile)/` | Stack: edit-profile, visibility-preferences, export-data, payment-plan, notifications |
| `app/(add)/` | Stack: manual expense, scan-review (post-scan placeholder) |

Root: `app/_layout.tsx` — QueryClient, ThemeProvider, AuthProvider, ToastProvider, Stack. Tabs use `HapticTab`; async feedback via `shared/ui/Toast`.

---

## 6. Patterns & conventions

- **Forms:** react-hook-form + zod schemas in feature `lib/`.
- **Strings:** `t('…')`; English keys as source of truth.
- **Theme:** `shared/constants/theme.ts`, `tailwind.config.js` — light only.
- **Naming:** English in code and copy; match existing file and import style.

---

## 7. Roadmap (where to extend)

| Topic | Direction |
| --- | --- |
| Receipt scan | `PUT /api/transactions/{id}/update`, `GET .../image`, real review UI — extend `features/receipt-scan/`; show `scan_usage` on Add or Profile |
| Transactions | `GET/PATCH/DELETE /api/transactions`, income — extend `features/transactions/` + routes |
| CSV | `GET /api/transactions/export` — `features/export-csv/` or `app/(profile)/export-data.tsx` |
| Billing | Stripe — `features/subscription/` or `payment-plan.tsx` |
| Categories | Already normalized in `getCategories`; icons: `getCategoryIcon` in `shared/lib/categoryIcons.ts` |

---

## 8. Quick file map

`app/_layout.tsx` · `app/(tabs)/*` · `app/(auth)/*` · `app/(funnel)/*` · `app/(profile)/*` · `app/(add)/manual.tsx` · `app/(add)/scan-review.tsx` · `features/{auth,funnel,settings,home,transactions,receipt-scan}/` · `shared/{api,ui,i18n,constants,storage,lib}/` · `entities/`.

# AI Budget — Frontend Specification

Concise overview of the Expo / React Native client. For HTTP contracts and payloads, see `frontend-backend-spec.en.md` and `.cursor/api-routes.json`.

---

## 1. Product

Personal budget app (iOS, Android, Web): email/password auth, manual expenses, AI receipt scan (planned), category visibility, monthly summaries, CSV export on paid plans (backend + Stripe). **Implemented vs missing** (single source of truth):

| Area | Done | Not done |
| --- | --- | --- |
| Auth | Login, signup, token refresh, protected routes | — |
| Onboarding | Funnel: settings → visibility questions → tabs | — |
| Profile | Header, edit name; **currency / language / timezone** on `app/(tabs)/profile.tsx` (pickers, not separate routes) | — |
| Profile stack | `edit-profile`, `visibility-preferences`, placeholders: `payment-plan`, `export-data`, `notifications` | Stripe, CSV download, real notifications |
| Home | Month switcher, daily expense grid, expand → subcategories, loading/empty/error | Optional: charts, non-month ranges |
| Add tab | Manual expense `/(add)/manual` | Wire “Scan receipt”; `features/receipt-scan/` |
| Transactions | `POST /api/transactions` expense only | List, edit, delete, income type |
| Data | Summary + subcategory APIs on Home; `GET /api/categories` (`features/home/api/getCategories.ts`, `entities/category.ts`, `shared/lib/categoryIcons.ts`) | Standalone analytics screen (optional) |
| Billing / CSV | — | Export UI, Stripe portal |

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
| HTTP | `shared/api/client.ts`, `protectedClient.ts` (Bearer, 401 → refresh once → logout) |
| Other | date-fns, clsx; also e.g. Reanimated, MMKV, datetime picker — see `package.json` |

---

## 3. Architecture

**Feature-first** (details: `.cursor/rules/feature-first-architecture.mdc`). Top-level:

- **`app/`** — layouts, route groups; screens stay thin and compose features.
- **`shared/`** — API, UI kit, i18n, theme, env, storage helpers.
- **`entities/`** — shared types (e.g. `user.ts`, `category.ts`).
- **`features/`** — `auth`, `funnel`, `settings`, `home`, `transactions` (`api/`, `model/`, `ui/`, `lib/` as needed).

There is no separate `screens/` folder; routes live under `app/`.

**Env:** `EXPO_PUBLIC_*`; `shared/constants/env.ts` (`apiUrl`, `appEnv`, `apiSecret`).

---

## 4. Auth

- **`AuthProvider`** (`features/auth/providers/AuthProvider.tsx`): `bootstrapAuth` on mount; unauthenticated → `/(auth)/login`; authenticated in auth group → `/(tabs)` or `/(funnel)/settings` if no settings; authenticated on tabs without settings → `/(funnel)/settings`. Visibility step is reached via funnel navigation after settings, not as an extra redirect rule in `AuthProvider`.
- **`useAuthContext()`** (from `useAuth`): `signIn`, `signUp`, `signOut`, `bootstrapAuth`, `refetchMe`, `user`, `settings`, `subscription`, `scanUsage`, `status`, `error`, `setError`.

---

## 5. Navigation (expo-router)

| Group | Role |
| --- | --- |
| `app/(tabs)/` | Home, Add, Profile (currency/language/timezone live on Profile tab) |
| `app/(auth)/` | login, signup |
| `app/(funnel)/` | settings, visibility-questions |
| `app/(profile)/` | Stack: edit-profile, visibility-preferences, export-data, payment-plan, notifications |
| `app/(add)/` | manual expense |

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
| Transactions | `GET/PATCH/DELETE /api/transactions`, income — extend `features/transactions/` + routes |
| Receipt scan | `POST …/scan`, confirm flow, `scan_usage` / 403 — `features/receipt-scan/`, link from `app/(tabs)/add.tsx` |
| CSV | `GET …/export` — `features/export-csv/` or `app/(profile)/export-data.tsx` |
| Billing | Stripe — `features/subscription/` or `payment-plan.tsx` |
| Categories | Already normalized in `getCategories`; icons: `getCategoryIcon` in `shared/lib/categoryIcons.ts` |

---

## 8. Quick file map

`app/_layout.tsx` · `app/(tabs)/*` · `app/(auth)/*` · `app/(funnel)/*` · `app/(profile)/*` · `app/(add)/manual.tsx` · `features/{auth,funnel,settings,home,transactions}/` · `shared/{api,ui,i18n,constants,storage,lib}/` · `entities/`.

# AI Budget — Frontend Specification

Concise overview of the Expo / React Native client. For HTTP contracts and payloads, see `frontend-backend-spec.en.md`, `.cursor/backend-spec.md`, and `docs/api-routes.json`.

---

## 1. Product

Personal budget app (iOS, Android, Web): email/password auth, onboarding funnel, Home expense summaries, History, manual expenses, AI receipt scan with review, recurring expense rules (paid plans), category visibility, billing via Stripe (plans, Checkout, Customer Portal). CSV export is gated in the UI but the download flow is not finished yet.

**Implemented vs not done** (tracks the `ai-budget-front` repo):

| Area | Done | Not done |
| --- | --- | --- |
| Auth | Login, signup, token refresh, protected API client, logout | — |
| Onboarding | Funnel: settings → visibility questions → tabs | — |
| Profile | Header, edit name; currency / language / timezone; subscription block with **`scan_usage`** (`SubscriptionProfileBlock`) | — |
| Profile stack | `edit-profile`, `visibility-preferences`, **`payment-plan`** (plans, Checkout, Portal), **`export-data`** (paid gate; copy says export is coming soon), `notifications` | CSV file download/share (`GET /api/transactions/export`), real notification prefs |
| Home | Month switcher, daily expense grid, expand → subcategories, loading/empty/error | Optional: charts, non-month ranges, standalone analytics screen |
| History tab | Stack: list → transaction detail; **`GET /api/transactions`**, **`GET /api/transactions/{id}`**, **`DELETE`**; multi-line / AI edits via **`PUT /api/transactions/{id}/update`** | Income on manual create; **`PUT /api/transactions/{id}`** for simple one-line manual edits (backend exists; not wired as a separate client path) |
| Add tab | **Receipt scan**: image → **`POST /api/transactions/scan`** → `scan` → **`scan-review`** (lines, date, confirm via **`PUT .../update`**), `scan-review-item`, `scan-success` | Reliable receipt image preview on review (`ReceiptPreviewImage` / `GET .../image` exist but review screen notes preview not fully wired) |
| Add tab | Manual expense `/(add)/manual` | — |
| Transactions API (client) | **`POST`** manual **expense** only; **`GET`** list + detail; **`DELETE`**; receipt save **`PUT .../update`** | **`POST`** with **`income`**; generic **`PUT /api/transactions/{id}`** for manual one-line edits |
| Data | Summary + subcategory APIs on Home; **`GET /api/categories`** (`features/home/api/`, `entities/category.ts`, `shared/lib/categoryIcons.ts`) | — |
| Receipt scan | `features/receipt-scan/`: multipart scan, draft store, toasts, **`ReceiptSourceSheet`**, review UI, **`mapScannedDraft`** | Polish image preview on review; optional structured-editor UX |
| Billing | `features/billing/`, `features/subscription/`: **`GET /api/plans`**, Checkout + Portal URLs, paywall sheet, plan-gated features | Edge cases only you discover in QA |
| CSV | Paid gate + **`export-data`** screen placeholder | Implement download/share against **`GET /api/transactions/export`** |
| Recurring | `features/recurring-expenses/`, `app/(recurring)/` — CRUD + toggle (**Plus/Premium** per backend) | — |

---

## 2. Tech stack

| Layer | Packages |
| --- | --- |
| UI | React 19.1, React Native 0.81.x, Expo SDK ~54, expo-router |
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
- **`features/`** — among others: `auth`, `billing`, `subscription`, `funnel`, `settings`, `home`, `transactions`, `receipt-scan`, `recurring-expenses` (`api/`, `model/`, `ui/`, `lib/` as needed).

There is no separate `screens/` folder; routes live under `app/`.

**Env:** `EXPO_PUBLIC_*`; `shared/constants/env.ts` (`apiUrl`, `appEnv`, `apiSecret` for optional API key on all requests).

---

## 4. Auth

- **`AuthProvider`** (`features/auth/providers/AuthProvider.tsx`): `bootstrapAuth` on mount; unauthenticated → `/(auth)/login`; authenticated in auth group → `/(tabs)` or `/(funnel)/settings` if no settings; authenticated on tabs without settings → `/(funnel)/settings`. Visibility step is reached via funnel navigation after settings, not as an extra redirect rule in `AuthProvider`.
- **`useAuthContext()`** (from `useAuth`): `signIn`, `signUp`, `signOut`, `bootstrapAuth`, `refetchMe`, `user`, `settings`, `subscription`, `subscriptionStatus`, `scanUsage`, `status`, `error`, `setError`.

---

## 5. Navigation (expo-router)

| Group | Role |
| --- | --- |
| `app/(tabs)/` | Home, Add (scan + manual), **History** (nested stack), Profile |
| `app/(auth)/` | login, signup |
| `app/(funnel)/` | settings, visibility-questions |
| `app/(profile)/` | Stack: edit-profile, visibility-preferences, export-data, payment-plan, notifications |
| `app/(add)/` | Stack: manual, scan (fullscreen), scan-review, scan-review-item, scan-success |
| `app/(recurring)/` | Recurring expense list / detail / create (**paid feature gate** on backend) |

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
| Receipt scan | Finish review-screen receipt preview; keep using **`PUT /api/transactions/{id}/update`** and **`GET .../image`** |
| Transactions | **`POST`** income; **`PUT /api/transactions/{id}`** for one-line manual edits if product needs it |
| CSV | **`GET /api/transactions/export`** — implement in `export-data` or `features/export-csv/` |
| History / edits | Align all edit flows with backend rules for `created_by` (**user** / **ai** / **recurring**) |
| Categories | Already normalized in `getCategories`; icons: `getCategoryIcon` in `shared/lib/categoryIcons.ts` |

---

## 8. Quick file map

`app/_layout.tsx` · `app/(tabs)/*` · `app/(auth)/*` · `app/(funnel)/*` · `app/(profile)/*` · `app/(add)/*` · `app/(recurring)/*` · `features/{auth,billing,subscription,funnel,settings,home,transactions,receipt-scan,recurring-expenses}/` · `shared/{api,ui,i18n,constants,storage,lib}/` · `entities/` · `docs/api-routes.json`.

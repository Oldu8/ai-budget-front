# AI Budget — Frontend Specification

This document describes the AI Budget mobile frontend: technologies, architecture, implemented features, and planned logic. It complements the backend spec in `frontend-backend-spec.en.md`.

---

## 1. App Concept

AI Budget is a personal budget tracker mobile app:

- **Users** register and log in with email + password (auth proxied through backend).
- **Core flows:**
  - Create **manual transactions** (incomes / expenses).
  - Scan receipts with **AI scan** (photo → categorized items).
  - Enable / disable expense categories via visibility tags.
  - View expense summaries by category / subcategory for a period.
  - Export expenses to **CSV** (paid plans only).
- **Subscriptions** and AI scan limits are managed via Stripe on the backend.

The frontend is a cross-platform mobile app (iOS, Android, Web) built with Expo and React Native.

---

## 2. Tech Stack

### 2.1. Core

| Layer | Technology |
|-------|------------|
| **Framework** | React 19.1, React Native 0.81 |
| **Runtime** | Expo SDK 54 |
| **Navigation** | expo-router (file-based routing), @react-navigation, @react-navigation/bottom-tabs, @react-navigation/elements |
| **Styling** | NativeWind 4, tailwindcss, StyleSheet |
| **State (server)** | @tanstack/react-query, @tanstack/react-query-persist-client, @tanstack/query-async-storage-persister |
| **State (client)** | Zustand |
| **Forms** | react-hook-form, zod, @hookform/resolvers |
| **i18n** | i18next, react-i18next |
| **Storage** | expo-secure-store (native), @react-native-async-storage/async-storage (web) |
| **HTTP** | fetch + custom API client with Bearer auth and 401 refresh |
| **Dates** | date-fns |
| **Utilities** | clsx |

### 2.2. Installed Dependencies

| Package | Purpose |
|---------|---------|
| @expo/vector-icons | Icon set for cross-platform use |
| @hookform/resolvers | Zod resolver for react-hook-form |
| @react-native-async-storage/async-storage | Async storage (web fallback for tokens) |
| @react-native-community/netinfo | Network connectivity status |
| @react-navigation/bottom-tabs | Tab bar navigation |
| @react-navigation/elements | Navigation UI elements |
| @react-navigation/native | Core navigation primitives |
| @tanstack/query-async-storage-persister | Persist React Query cache to AsyncStorage |
| @tanstack/react-query | Server state management |
| @tanstack/react-query-persist-client | React Query persistence |
| clsx | Conditional class names |
| date-fns | Date formatting and manipulation |
| expo | Expo SDK |
| expo-constants | App constants (version, etc.) |
| expo-font | Custom fonts |
| expo-haptics | Haptic feedback |
| expo-image | Optimized image component |
| expo-linking | Deep linking |
| expo-localization | Device locale |
| expo-router | File-based routing |
| expo-secure-store | Secure token storage (native) |
| expo-splash-screen | Splash screen control |
| expo-status-bar | Status bar styling |
| expo-symbols | SF Symbols on iOS |
| expo-system-ui | System UI (status bar, etc.) |
| expo-web-browser | In-app browser |
| i18next | i18n core |
| nativewind | Tailwind CSS for React Native |
| react, react-dom | UI framework |
| react-hook-form | Form state management |
| react-i18next | React bindings for i18next |
| react-native | Mobile framework |
| react-native-gesture-handler | Gesture handling |
| react-native-mmkv | Fast key-value storage |
| react-native-reanimated | Animations |
| react-native-safe-area-context | Safe area insets |
| react-native-screens | Native screen containers |
| react-native-web | Web support |
| react-native-worklets | Worklets for Reanimated |
| tailwindcss | Tailwind CSS |
| zod | Schema validation |
| zustand | Client state management |

### 2.3. Dev Dependencies

| Package | Purpose |
|---------|---------|
| @types/react | React type definitions |
| eslint | Linting |
| eslint-config-expo | Expo ESLint config |
| typescript | TypeScript compiler |

---

## 3. Architecture

### 3.1. Feature-First Structure

The project uses a **feature-first modular architecture** (see `.cursor/rules/feature-first-architecture.mdc`):

```
app/          — App bootstrap, providers, navigation, root layout
shared/       — Reusable UI, API client, utilities, constants, storage, i18n
entities/    — Domain entity types (User, Category, Transaction, etc.)
features/    — Business features (auth, funnel, settings)
```

- **app/** — Application-wide setup only (QueryClient, AuthProvider, Stack, tabs). No feature-specific logic.
- **shared/** — Cross-feature code: API client, UI kit, helpers, constants, secure storage, i18n.
- **entities/** — Shared domain types aligned with backend (AppUser, AppUserSettings, Plan, etc.).
- **features/** — Isolated business features. Each may have:
  - `api/` — endpoint functions
  - `model/` — React Query hooks, Zustand stores, derived logic
  - `ui/` — feature-specific components
  - `lib/` — internal helpers

Screens live in `app/` and compose features; they stay thin and orchestrate data + UI.

### 3.2. API Layer

- **`shared/api/client.ts`** — Base `api.get/post/put/patch` with optional `accessToken`, `X-API-Key` when `env.apiSecret` is set.
- **`shared/api/protectedClient.ts`** — `protectedGet`, `protectedPost`, `protectedPut`, `protectedPatch`: add Bearer token, on 401 attempt refresh and retry once; on refresh failure call `authErrorHandler` (logout + redirect).
- **`shared/storage/tokenStorage.ts`** — SecureStore (native) / AsyncStorage (web) for access and refresh tokens.

### 3.3. Auth Flow

- **AuthProvider** (`features/auth/providers/AuthProvider.tsx`) wraps the app and:
  - Bootstraps auth on mount (load tokens, fetch `/api/me`).
  - Redirects unauthenticated users to `/(auth)/login`.
  - Redirects authenticated users without settings to `/(funnel)/settings`.
  - Redirects authenticated users with settings to `/(tabs)` or `/(funnel)/visibility-questions` as needed.
- **useAuthContext()** exposes: `signIn`, `signUp`, `signOut`, `bootstrapAuth`, `user`, `settings`, `status`, `error`, `setError`.
- Tokens are stored in memory and SecureStore; `setAuthTokens` / `clearAuthTokens` are wired to the protected client and AuthProvider.

### 3.4. Environment

- Env vars use `EXPO_PUBLIC_*` prefix (Expo loads from `.env`, `.env.local`, `.env.production`).
- **`shared/constants/env.ts`** exposes: `apiUrl`, `appEnv`, `apiSecret`.

---

## 4. Libraries and Patterns

### 4.1. Forms and Validation

- **react-hook-form** for form state.
- **zod** for schema validation.
- **@hookform/resolvers/zod** for `zodResolver( schema )`.
- Schemas live in feature `lib/` (e.g. `editProfileSchema`, `settingsSchema`).

### 4.2. Internationalization

- **i18next** + **react-i18next**.
- Locales: `en` (default), `es`, `uk`.
- Dictionary: `shared/i18n/locales/en.ts` (and `es`, `uk`).
- `setLanguage(lang)` updates runtime language; used when user changes language in settings.
- All user-facing strings go through `t('key')`; English is the source of truth.

### 4.3. Styling

- **NativeWind** (Tailwind for React Native) + **global.css**.
- **shared/constants/theme.ts** — `Colors`, `Fonts` for semantic and brand palette.
- **tailwind.config.js** — `brand.*` palette (primary, grey, etc.).
- Light theme only; no dark mode.

### 4.4. Navigation

- **expo-router** file-based routing:
  - `app/(tabs)/` — main tab navigator (Home, Add, Profile).
  - `app/(auth)/` — login, signup.
  - `app/(funnel)/` — onboarding (settings, visibility-questions).
  - `app/(profile)/` — profile sub-screens (edit-profile, currency, language, timezone, visibility-preferences, export-data, payment-plan, notifications).
- Bottom tabs use `HapticTab` for haptic feedback.

---

## 5. Implemented Features

### 5.1. Authentication

| Feature | Status | Notes |
|---------|--------|-------|
| Login | ✅ | Email + password, redirect to tabs or funnel |
| Signup | ✅ | Email + password, redirect to funnel settings |
| Logout | ✅ | Clears tokens, resets store, redirects to login |
| Token refresh | ✅ | Automatic on 401, retry once; on failure → logout |
| Protected routes | ✅ | AuthProvider redirects by auth status and settings |

**Files:** `features/auth/`, `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`.

### 5.2. Onboarding Funnel

| Feature | Status | Notes |
|---------|--------|-------|
| Basic settings | ✅ | First name, last name, currency, language, timezone |
| Visibility questions | ✅ | Enable/disable category groups by tag (car, kids, rent, etc.) |
| Skip visibility | ✅ | Optional step; can skip and continue to tabs |

**Flow:** After signup → `/(funnel)/settings` → `/(funnel)/visibility-questions` → `/(tabs)`.

**Files:** `features/funnel/`, `app/(funnel)/settings.tsx`, `app/(funnel)/visibility-questions.tsx`.

### 5.3. Profile and Settings

| Feature | Status | Notes |
|---------|--------|-------|
| Profile header | ✅ | Initials avatar, name |
| Edit profile | ✅ | First name, last name via PUT /api/me |
| Currency | ✅ | SearchableSelect, PUT /api/me/settings |
| Language | ✅ | SearchableSelect, PUT /api/me/settings, updates i18n |
| Timezone | ✅ | SearchableSelect, PUT /api/me/settings |
| Visibility preferences | ✅ | Same PreferencesForm as onboarding; PATCH /api/me/category-visibility |
| Payment & Plan | 🔲 | Placeholder screen |
| Export Data | 🔲 | Placeholder screen |
| Notifications | 🔲 | Placeholder screen |

**Files:** `features/settings/`, `app/(tabs)/profile.tsx`, `app/(profile)/*`.

### 5.4. Main Tabs

| Tab | Status | Notes |
|-----|--------|-------|
| Home | 🔲 | Placeholder (title + description) |
| Add | 🔲 | Placeholder (title + description) |
| Profile | ✅ | Full profile screen with settings links |

---

## 6. Planned Logic (Not Yet Implemented)

### 6.1. Manual Transactions

- **Create:** Form with amount, date, type (income/expense), category → `POST /api/transactions`.
- **List:** Fetch `GET /api/transactions` with filters (from, to, type).
- **Edit:** `PUT /api/transactions/{id}`.
- **Delete:** `DELETE /api/transactions/{id}` (soft delete).

Planned location: `features/transactions/`.

### 6.2. AI Receipt Scan

- **Scan:** `POST /api/transactions/scan` (multipart with image).
- **Confirm:** Show recognized items, allow edits, then `POST /api/transactions/{id}/confirm`.
- **Limits:** Use `scan_usage` from `/api/me`; handle 403 (subscription required, limit reached).

Planned location: `features/receipt-scan/`.

### 6.3. Expense Summaries (Analytics)

- **Summary by Level 1:** `GET /api/transactions/summary?from&to`.
- **Summary by subcategory:** `GET /api/transactions/summary/{category}?from&to`.
- Charts/dashboards using `days` + `/api/categories` for labels; amounts in currency units (`amount / 100`).

Planned location: `features/summaries/` or integrated into Home.

### 6.4. CSV Export

- **Endpoint:** `GET /api/transactions/export?from=YYYY-MM-DD&to=YYYY-MM-DD`.
- **Plan restriction:** Basic, Plus, Premium only; 403 for Free.
- Frontend: date range picker, fetch with `Accept: text/csv`, download/share file.

Planned location: `features/export-csv/` or extend `app/(profile)/export-data.tsx`.

### 6.5. Payment & Plan

- Stripe integration for subscription management.
- Show current plan, upgrade/downgrade, billing portal.

Planned location: `features/subscription/` or extend `app/(profile)/payment-plan.tsx`.

### 6.6. Categories

- `GET /api/categories` — category tree (backend filters disabled categories).
- Used by transaction form, summaries, and visibility funnel.
- Planned: `features/transactions/` or `entities/category.ts` + shared hooks.

**Category tree (response shape from `GET /api/categories`):**

```json
{
  "data": [
    {
      "id": 36,
      "slug": "connectivity",
      "label": "Connectivity",
      "children": [
        { "id": 37, "slug": "connectivity_mobile", "label": "Mobile Plan" },
        { "id": 38, "slug": "connectivity_internet", "label": "Home Internet" },
        { "id": 39, "slug": "connectivity_topups", "label": "Top-ups" },
        { "id": 40, "slug": "connectivity_other", "label": "Other" }
      ]
    },
    {
      "id": 91,
      "slug": "finance",
      "label": "Finance",
      "children": [
        { "id": 92, "slug": "finance_taxes", "label": "Taxes" },
        { "id": 96, "slug": "finance_fees", "label": "Fees" },
        { "id": 97, "slug": "finance_other", "label": "Other" }
      ]
    },
    {
      "id": 79,
      "slug": "gifts",
      "label": "Gifts",
      "children": [
        { "id": 80, "slug": "gifts_family", "label": "Family" },
        { "id": 81, "slug": "gifts_friends", "label": "Friends" },
        { "id": 82, "slug": "gifts_work", "label": "Colleagues" },
        { "id": 83, "slug": "gifts_charity", "label": "Charity" },
        { "id": 84, "slug": "gifts_other", "label": "Other" }
      ]
    },
    {
      "id": 31,
      "slug": "health",
      "label": "Health",
      "children": [
        { "id": 32, "slug": "health_medicines", "label": "Medicines" },
        { "id": 33, "slug": "health_treatment_tests", "label": "Treatment & Tests" },
        { "id": 34, "slug": "health_dental", "label": "Dental" },
        { "id": 35, "slug": "health_other", "label": "Other" }
      ]
    },
    {
      "id": 1,
      "slug": "home",
      "label": "Home",
      "children": [
        { "id": 2, "slug": "home_groceries", "label": "Groceries" },
        { "id": 3, "slug": "home_snacks", "label": "Snacks" },
        { "id": 4, "slug": "home_drinks", "label": "Drinks" },
        { "id": 5, "slug": "home_household", "label": "Household" },
        { "id": 6, "slug": "home_other", "label": "Other" }
      ]
    },
    {
      "id": 25,
      "slug": "housing",
      "label": "Housing",
      "children": [
        { "id": 27, "slug": "housing_utilities", "label": "Utilities" },
        { "id": 28, "slug": "housing_furniture", "label": "Furniture" },
        { "id": 29, "slug": "housing_repairs", "label": "Repairs" },
        { "id": 30, "slug": "housing_other", "label": "Other" }
      ]
    },
    {
      "id": 67,
      "slug": "leisure",
      "label": "Leisure",
      "children": [
        { "id": 68, "slug": "leisure_food_delivery", "label": "Cafes & Delivery" },
        { "id": 69, "slug": "leisure_entertainment", "label": "Entertainment" },
        { "id": 70, "slug": "leisure_travel", "label": "Travel" },
        { "id": 71, "slug": "leisure_hobbies", "label": "Hobbies" },
        { "id": 72, "slug": "leisure_other", "label": "Other" }
      ]
    },
    {
      "id": 73,
      "slug": "shopping",
      "label": "Shopping",
      "children": [
        { "id": 74, "slug": "shopping_clothes", "label": "Clothes" },
        { "id": 75, "slug": "shopping_shoes", "label": "Shoes" },
        { "id": 76, "slug": "shopping_electronics", "label": "Electronics" },
        { "id": 77, "slug": "shopping_tools", "label": "Tools" },
        { "id": 78, "slug": "shopping_other", "label": "Other" }
      ]
    },
    {
      "id": 41,
      "slug": "subscriptions",
      "label": "Subscriptions",
      "children": [
        { "id": 42, "slug": "subscriptions_streaming", "label": "Streaming" },
        { "id": 43, "slug": "subscriptions_apps", "label": "Apps & Services" },
        { "id": 44, "slug": "subscriptions_cloud", "label": "Cloud Storage" },
        { "id": 45, "slug": "subscriptions_other", "label": "Other" }
      ]
    },
    {
      "id": 13,
      "slug": "transport",
      "label": "Transport",
      "children": [
        { "id": 14, "slug": "transport_taxi", "label": "Taxi" },
        { "id": 15, "slug": "transport_public", "label": "Public Transport" },
        { "id": 16, "slug": "transport_flights", "label": "Flights" },
        { "id": 17, "slug": "transport_trains", "label": "Trains" },
        { "id": 18, "slug": "transport_other", "label": "Other" }
      ]
    },
    {
      "id": 85,
      "slug": "work",
      "label": "Work",
      "children": [
        { "id": 86, "slug": "work_courses", "label": "Courses" },
        { "id": 87, "slug": "work_expenses", "label": "Expenses" },
        { "id": 88, "slug": "work_software", "label": "Software" },
        { "id": 89, "slug": "work_equipment", "label": "Equipment" },
        { "id": 90, "slug": "work_other", "label": "Other" }
      ]
    }
  ]
}
```

**Main category icons (used in expense table, subcategories have no icon):**

| Slug | Icon |
|------|------|
| connectivity | wifi |
| finance | dollarsign.circle.fill |
| gifts | gift |
| health | heart.fill |
| home | house.fill |
| housing | apartment |
| leisure | gamecontroller.fill |
| shopping | bag.fill |
| subscriptions | bolt.fill |
| transport | car.fill |
| work | briefcase.fill |

---

## 7. File Map

| Area | Path | Purpose |
|------|------|---------|
| App entry | `app/_layout.tsx` | QueryClient, ThemeProvider, AuthProvider, Stack |
| Tabs | `app/(tabs)/_layout.tsx` | Bottom tabs (Home, Add, Profile) |
| Auth | `app/(auth)/` | login, signup |
| Funnel | `app/(funnel)/` | settings, visibility-questions |
| Profile | `app/(profile)/` | edit-profile, currency, language, timezone, visibility-preferences, export-data, payment-plan, notifications |
| Auth feature | `features/auth/` | AuthProvider, useAuth, authApi, getMe, updateMe, EmailInput, PasswordInput |
| Funnel feature | `features/funnel/` | BasicSettingsForm, PreferencesForm, createSettings, getVisibilityQuestions, getVisibilityTags, useVisibilityQuestionsQuery, useVisibilityTagsQuery |
| Settings feature | `features/settings/` | ProfileHeader, SettingsRow, SettingsSection, InitialsAvatar, updateSettings, editProfileSchema |
| Entities | `entities/user.ts` | AppUser, AppUserSettings, Plan, UserSubscription, ScanUsage |
| API | `shared/api/` | client, protectedClient |
| Storage | `shared/storage/` | tokenStorage |
| i18n | `shared/i18n/` | init, locales (en, es, uk) |
| Constants | `shared/constants/` | theme, env, currencies, languages, timezones |
| UI | `shared/ui/` | ThemedText, ThemedView, Button, ScreenContainer, SearchableSelect, IconSymbol, HapticTab |

---

## 8. Conventions

- **Naming:** English for all labels, descriptions, and code.
- **Vocabulary:** Use project i18n keys; avoid hardcoded strings.
- **Theme:** Light only; no dark mode.
- **Comments:** Add short docblocks or inline comments for non-trivial logic.
- **API reference:** See `frontend-backend-spec.en.md` and `.cursor/api-routes.json` for endpoints and data shapes.

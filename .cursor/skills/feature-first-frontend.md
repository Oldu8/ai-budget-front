# Feature-First Frontend Architecture

This project uses a **feature-first modular architecture**.

The main idea is to organize code by **business feature** instead of technical file type.  
This keeps related logic close together and makes the codebase easier to scale and maintain.

---

# Top-Level Structure

src/
app/
shared/
entities/
features/
screens/

### `app/`

Application bootstrap and global setup.

Examples:

- providers (React Query, Auth)
- navigation
- global configuration

---

### `shared/`

Reusable code used across multiple features.

Examples:

- API client
- UI components
- utilities
- constants
- storage helpers

Only place code here if it is **truly reusable**.

---

### `entities/`

Shared domain models and types.

Examples:

- `User`
- `Category`
- `Transaction`
- `Subscription`

Entities represent stable business objects used by multiple features.

---

### `features/`

Business functionality grouped by product capability.

Examples:

features/
auth/
transactions/
receipt-scan/
summaries/
settings/
category-visibility/
export-csv/

Typical feature structure:

features/<feature-name>/
api/
model/
ui/
lib/

- **api/** — backend request functions
- **model/** — React Query hooks and feature logic
- **ui/** — feature-specific components
- **lib/** — helpers used only by this feature

---

### `screens/`

Screen-level composition.

Screens should:

- compose feature hooks and components
- handle layout and navigation

Screens should **not contain complex business logic or raw API calls**.

---

# Architecture Rules

1. Organize code by **feature**, not file type.
2. Keep related API, hooks, and UI **inside the same feature**.
3. Keep screens **thin** and focused on composition.
4. Place code in `shared/` **only if reused across features**.
5. Put stable domain types in `entities/`.
6. Avoid unnecessary abstractions (repositories, service layers, etc.).

---

# Goal

This architecture prioritizes:

- clear structure
- high cohesion inside features
- low coupling between features
- easier scaling as the application grows

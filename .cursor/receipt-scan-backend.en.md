# Receipt scanning — backend behavior (for frontend integration)

## Overview

Receipt scanning is **not** a separate OCR service. The backend uploads the photo to **Supabase Storage**, sends the image as **base64** to **OpenAI `gpt-4o-mini`** in **JSON mode** with a **system prompt** that includes allowed categories, then **creates an expense transaction** with line items. The user **saves edits and confirms** in one step (`PUT .../update`) before the transaction appears in the main transaction list and summaries.

---

## API surface

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/transactions/scan` | Upload image, run AI, create draft transaction |
| `PUT` | `/api/transactions/{transaction}/update` | Save edited receipt (`date`, `items[]`) and confirm (`confirmed_at`) in one request |
| `GET` | `/api/transactions/{transaction}/image` | Signed URL JSON for receipt preview |

All routes use the same authenticated API as the rest of the app (`Authorization: Bearer`, optional `X-API-Key` if configured).

### Scan request

- **Content-Type:** `multipart/form-data`
- **Field name:** `image` (required)
- **Validation** (`ScanRequest`): `jpeg`, `jpg`, `png`, `webp`, **max 5 MB** (5120 KB)

---

## End-to-end flow (backend)

1. **Subscription and quota (before upload / AI)**  
   `FeatureAccessService::canUseAiScan($user)` checks the **`ai_scan`** feature (`config/feature_access.php`):
   - User must have an **active subscription** with a loaded plan (`active` or `trialing` — see `AppUser::activeSubscription()`).
   - If there is no subscription → **403** with `"Subscription required to scan."`
   - If `used_checks_count >= plan.check_limit` → **403** with `"Scan limit reached for this billing period."`

2. **Encode and upload**  
   The file is **base64-encoded** for OpenAI; the **original bytes** are uploaded to Supabase Storage via `SupabaseStorageService::upload`. Path shape: `{userId}/{uuid}.{ext}` in the configured bucket (default `receipts` from env).

3. **Category list for the model**  
   Categories loaded for the prompt:
   - Only rows with **`category_id` not null** (subcategories / leaf categories).
   - **`with('parent')`** so the prompt can group by parent label.
   - IDs in the user’s **disabled** category settings (`app_user_category_settings`) are **excluded** — same idea as hiding categories elsewhere.

4. **OpenAI call** (`ScanService::scan`)  
   - Model: **`gpt-4o-mini`**
   - **`response_format`: JSON object**
   - **`max_tokens`: 2048**
   - **User message** contains one `image_url` with `data:{mime};base64,...` plus text: *"Analyze this image and return a structured JSON response."*
   - **System message** is built by `ScanPromptBuilder` and embeds the **JSON of categories grouped by parent label** (`id` + `label` per subcategory).

5. **AI contract (what the model is asked to return)**  
   From `ScanPromptBuilder`:
   - If the image is **not** a financial document → `{"is_receipt": false, "message": "reason"}`
   - If it **is** → `{"is_receipt": true, "date": "YYYY-MM-DD", "total_amount": <int minor units>, "items": [...]}`
   - Each item: `product`, `amount` (minor units), `category_id`, `category_label`
   - Rules: amounts in **smallest currency unit**; **sum of item amounts = total_amount**; if date unreadable use today; if line items unclear, single item with total; **JSON only**.

6. **Backend handling of the AI response**

   | Condition | HTTP | Behavior |
   |-----------|------|----------|
   | OpenAI throws / invalid JSON | **503** | User-facing AI failure message; **upload may have succeeded** — response can include **`img_path`** so ops/user know an object exists |
   | `is_receipt` falsy / empty | **422** | Image **deleted** from storage; message from AI or default “not a valid financial document” |
   | Receipt but missing `total_amount`, `date`, or `items` (empty fails `empty()` in PHP) | **422** | Message about incomplete data; **`img_path`** may still be present if upload happened |

7. **Successful parse → DB (single transaction)**  
   - Creates **`Transaction`**: `type` = **expense** (hardcoded), `created_by` = **`ai`**, **`confirmed_at` = `null`**, `img_path` set, **`raw_ai_data`** = full AI payload, `total_amount` and `date` from AI.
   - For each item: **`TransactionItem`** with `amount`, `label` from `product`, `category_id` **validated** against the same category list; if `category_id` is missing or not in the list → **`finance_other_misc`** subcategory id as fallback (if that category exists).
   - **`used_checks_count`** on the active subscription is **incremented** once per successful scan.
   - Response: **201** with transaction JSON (Laravel **`TransactionResource`** shape — typically `{ "data": { ... } }` with nested `items.category`).

### Receipt update (`PUT /api/transactions/{transaction}/update`)

- Authorization: **`created_by` = `ai`**, **`confirmed_at` null**, owner only (else **404**).
- Body: **`date`**, **`items[]`** (optional **`id`** per line; full sync semantics; server sums **`total_amount`**).
- In **one DB transaction**: apply line items, then **`confirmed_at = now()`**.
- Returns **`TransactionResource`** with **`items.category`** loaded.

---

## How this affects lists, summaries, and “draft” behavior

- **`GET /api/transactions`** (index) applies **`whereNotNull('confirmed_at')`**.  
  So **unconfirmed AI scans do not appear in the paginated history** until confirmed.

- **Summaries / export** also filter **`confirmed_at` not null**, so unconfirmed AI transactions **do not** affect aggregates or CSV until confirmed.

- **`GET /api/transactions/{id}`** (`show`) does **not** require `confirmed_at`, so the client can still **fetch a specific draft** by id (e.g. right after scan returns 201) if you store that id.

---

## Response shapes the frontend should handle

**201 (success)** — Laravel API resource wrapping is assumed; the **Expo app** parses **`data`** via `features/receipt-scan/lib/mapScannedDraft.ts`:

- `created_by`: `"ai"`
- `type`: `"expense"`
- `confirmed_at`: `null` until `PUT .../update`
- `raw_ai_data`: full parsed AI payload
- `img_path`: storage object path (string)
- `items[]` with nested `category` where loaded

**403** — `{ "message": "..." }` (subscription or quota)

**503** — AI failure; body may include **`img_path`** if the file was uploaded before the model call failed

**422** — Validation / not a receipt / incomplete AI; **`img_path`** may or may not be present depending on failure point

---

## Scan usage for the UI (`GET /api/me`)

`scan_usage` is included on **`GET /api/me`**:

- `scans_remaining`, `scans_limit`, `period_end` (ISO 8601 from `current_period_end`, or zeros / null if no subscription)

The app loads this in auth state but does **not** yet show a dedicated “scans remaining” UI on Add/Profile.

---

## Receipt images and the frontend

Storage is **private** (service role). **`GET /api/transactions/{transaction}/image`** returns `{ "url", "expires_in" }` (signed URL) for preview. Scan/update responses still include **`img_path`** as the opaque storage key. **Not wired in the Expo client yet.**

---

## Key implementation files (Laravel backend repo)

- `app/Http/Controllers/ScanController.php` — `scan()`, `updateReceipt()`, `image()`
- `app/Services/ReceiptTransactionService.php` — `saveAndConfirm()` for `PUT .../update`
- `app/Services/ScanService.php` — OpenAI API call
- `app/Services/Scan/ScanPromptBuilder.php` — prompt construction and category grouping
- `app/Http/Requests/ScanRequest.php` — image validation
- `app/Services/FeatureAccessService.php` — `canUseAiScan()`
- `config/feature_access.php` — `ai_scan` messages and plan allowlist

---

## Expo client (`ai-budget-front`) — implemented vs pending

| Piece | Status |
| --- | --- |
| `POST /api/transactions/scan` (multipart `image`) | Implemented — `features/receipt-scan/api/scanReceipt.ts`, `useScanReceiptMutation`, error mapping (`getScanErrorToastText`) |
| Parse 201 body | `mapScannedDraft` expects **`{ data: { ...transaction } }`** |
| Post-scan screen | `app/(add)/scan-review.tsx` — **placeholder** (shows draft summary + raw JSON); no edit/confirm |
| `PUT .../update` | **Not implemented** |
| `GET .../image` | **Not implemented** |
| Display `scan_usage` | Data available from `GET /api/me`; **no dedicated UI** yet |

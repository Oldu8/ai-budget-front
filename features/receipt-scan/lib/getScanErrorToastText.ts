import type { TFunction } from "i18next";

import { ApiError } from "@/shared/api/client";

const LARAVEL_GENERIC = new Set([
  "The given data was invalid.",
  "The given data was invalid",
]);

/** Backend `code` → i18n key (add.receiptScan.errors.*). */
const ERROR_CODE_TO_KEY: Record<string, string> = {
  ai_quota_exhausted: "add.receiptScan.errors.aiQuotaExhausted",
  ai_rate_limited: "add.receiptScan.errors.aiRateLimited",
  ai_unavailable: "add.receiptScan.errors.aiUnavailable",
  ai_failed: "add.receiptScan.errors.aiFailed",
  incomplete_data: "add.receiptScan.errors.incompleteData",
  unsupported_currency: "add.receiptScan.errors.unsupportedCurrency",
};

function isMeaningfulBackendMessage(msg: string): boolean {
  const s = msg.trim();
  if (!s) return false;
  return !LARAVEL_GENERIC.has(s);
}

export function getScanErrorToastText(err: unknown, t: TFunction): string {
  if (!(err instanceof ApiError)) {
    return t("add.receiptScan.errors.generic");
  }

  const body = err.body as Record<string, unknown> | undefined;

  const code = typeof body?.code === "string" ? body.code : null;
  if (code && ERROR_CODE_TO_KEY[code]) {
    return t(ERROR_CODE_TO_KEY[code]);
  }

  if (err.status === 422 && body) {
    const errors = body.errors;
    if (errors && typeof errors === "object" && errors !== null) {
      const img = (errors as { image?: unknown }).image;
      if (
        Array.isArray(img) &&
        typeof img[0] === "string" &&
        img[0].trim() !== ""
      ) {
        return img[0];
      }
    }
    const msg = body.message;
    if (typeof msg === "string" && isMeaningfulBackendMessage(msg)) {
      return msg;
    }
    return t("add.receiptScan.errors.invalidReceipt");
  }

  if (err.status === 503) {
    return t("add.receiptScan.errors.aiFailed");
  }

  if (err.status === 403 || err.status === 401) {
    if (
      body &&
      typeof body.message === "string" &&
      body.message.trim() !== ""
    ) {
      return body.message;
    }
    if (err.message) return err.message;
    return t("add.receiptScan.errors.generic");
  }

  if (err.message) return err.message;
  return t("add.receiptScan.errors.generic");
}

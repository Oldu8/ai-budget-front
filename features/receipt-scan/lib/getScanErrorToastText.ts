import type { TFunction } from "i18next";

import { ApiError } from "@/shared/api/client";
// TODO: needs to refactore and improve

const LARAVEL_GENERIC = new Set([
  "The given data was invalid.",
  "The given data was invalid",
]);

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

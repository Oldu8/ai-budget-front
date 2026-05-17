/**
 * Lets scan-review navigate away without firing the draft-loss `Alert` (`beforeRemove` guard).
 * Call `bypassReceiptReviewLeaveGuardOnce` immediately before programmatic `router.back` / replace
 * (confirm success, discard success, retry, 404 dismissal, …), then consume on the leave event.
 */
let bypassReceiptReviewLeaveGuard = false;

export function bypassReceiptReviewLeaveGuardOnce(): void {
  bypassReceiptReviewLeaveGuard = true;
}

export function consumeReceiptReviewLeaveGuard(): boolean {
  const prev = bypassReceiptReviewLeaveGuard;
  bypassReceiptReviewLeaveGuard = false;
  return prev;
}

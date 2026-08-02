import {
  bypassReceiptReviewLeaveGuardOnce,
  consumeReceiptReviewLeaveGuard,
} from './receiptReviewLeaveGuard';

describe('receiptReviewLeaveGuard', () => {
  it('defaults to not bypassed', () => {
    expect(consumeReceiptReviewLeaveGuard()).toBe(false);
  });

  it('returns true exactly once after arming the bypass', () => {
    bypassReceiptReviewLeaveGuardOnce();
    expect(consumeReceiptReviewLeaveGuard()).toBe(true);
    expect(consumeReceiptReviewLeaveGuard()).toBe(false);
  });
});

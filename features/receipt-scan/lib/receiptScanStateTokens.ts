/**
 * Layout tokens for receipt scan state screens.
 * Aligns with ScreenContainer (24px horizontal), ScanReviewSummaryCard, and brand palette.
 * Stitch MCP design tokens can be merged here when available.
 */
import { Colors } from '@/shared/constants/theme';

export const receiptScanStateTokens = {
  horizontalPadding: 24,
  iconCircleSize: 72,
  iconInnerSize: 36,
  ringSize: 88,
  ringStroke: 4,
  titleToSubtitleGap: 12,
  subtitleToBodyGap: 24,
  cardRadius: 16,
  cardPadding: 16,
  primary: Colors.primary,
  grey: Colors.grey,
  white: Colors.white,
  black: Colors.black,
} as const;

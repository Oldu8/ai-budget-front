import React from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/ui/Button';
import { ThemedText } from '@/shared/ui/ThemedText';

export type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  /** Disables prev/next (e.g. while refetching). */
  busy?: boolean;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  /** Center text, e.g. `t('history.pageOf', { current, total })` */
  pageStatusLabel: string;
};

/**
 * Bottom bar: previous / page X of Y / next. Renders nothing when `totalPages <= 1`.
 */
export function PaginationBar({
  currentPage,
  totalPages,
  busy = false,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  pageStatusLabel,
}: PaginationBarProps) {
  if (totalPages <= 1) {
    return null;
  }

  const atFirst = currentPage <= 1;
  const atLast = currentPage >= totalPages;

  return (
    <View className="flex-row items-center justify-between gap-3 border-t border-brand-grey-hover bg-brand-white px-4 py-3">
      <View className="flex-1">
        <Button
          variant="secondary"
          disabled={atFirst || busy}
          onPress={onPrev}
        >
          {prevLabel}
        </Button>
      </View>
      <ThemedText className="text-sm text-brand-grey">{pageStatusLabel}</ThemedText>
      <View className="flex-1">
        <Button variant="secondary" disabled={atLast || busy} onPress={onNext}>
          {nextLabel}
        </Button>
      </View>
    </View>
  );
}

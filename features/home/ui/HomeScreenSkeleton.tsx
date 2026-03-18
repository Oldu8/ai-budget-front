import React from 'react';
import { View } from 'react-native';

const CATEGORY_WIDTH = 120;
const CELL_WIDTH = 44;
const TOTAL_WIDTH = 72;
const ROW_HEIGHT = 40;
const ROWS = 5;
const DAYS = 7;

export function HomeScreenSkeleton() {
  const tableWidth = CATEGORY_WIDTH + DAYS * CELL_WIDTH + TOTAL_WIDTH;

  return (
    <View className="flex-1 bg-brand-grey-low p-4">
      <View
        className="rounded-lg border border-brand-grey-hover bg-brand-white overflow-hidden"
        style={{ minWidth: tableWidth }}
      >
        <View className="flex-row border-b border-brand-grey-hover">
          <View
            className="bg-brand-grey-low"
            style={{ width: CATEGORY_WIDTH, height: ROW_HEIGHT }}
          />
          {Array.from({ length: DAYS }).map((_, i) => (
            <View
              key={i}
              className="border-r border-brand-grey-hover bg-brand-grey-low"
              style={{ width: CELL_WIDTH, height: ROW_HEIGHT }}
            />
          ))}
          <View
            className="border-l-2 border-l-brand-primary bg-brand-grey-low"
            style={{ width: TOTAL_WIDTH, height: ROW_HEIGHT }}
          />
        </View>
        {Array.from({ length: ROWS }).map((_, i) => (
          <View key={i} className="flex-row border-b border-brand-grey-hover">
            <View
              className="bg-brand-white"
              style={{ width: CATEGORY_WIDTH, height: ROW_HEIGHT }}
            />
            {Array.from({ length: DAYS }).map((_, j) => (
              <View
                key={j}
                className="border-r border-brand-grey-hover bg-brand-white"
                style={{ width: CELL_WIDTH, height: ROW_HEIGHT }}
              />
            ))}
            <View
              className="border-l-2 border-l-brand-primary bg-brand-white"
              style={{ width: TOTAL_WIDTH, height: ROW_HEIGHT }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import type { Category } from '@/entities/category';
import { Colors } from '@/shared/constants/theme';
import { getCategoryMaterialIconName } from '@/shared/lib/categoryIcons';
import {
  findParentOfSubcategory,
  parentCategoriesWithChildren,
} from '@/shared/lib/categoryTree';
import { CategoryIcon } from '@/shared/ui/CategoryIcon';
import { ThemedText } from '@/shared/ui/ThemedText';

interface CategoryGridProps {
  categories: Category[];
  selectedSubcategoryId: number | null;
  /** Pass `null` to clear selection (e.g. when changing parent category). */
  onSelectSubcategory: (subcategoryId: number | null) => void;
  disabled?: boolean;
}

export function CategoryGrid({
  categories,
  selectedSubcategoryId,
  onSelectSubcategory,
  disabled = false,
}: CategoryGridProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedSubcategoryId != null && expandedId == null) {
      const parent = findParentOfSubcategory(categories, selectedSubcategoryId);
      if (parent) setExpandedId(parent.id);
    }
  }, [selectedSubcategoryId, categories, expandedId]);

  const parentCategories = parentCategoriesWithChildren(categories);

  const handleParentPress = (cat: Category) => {
    if (disabled) return;

    setExpandedId((prev) => (prev === cat.id ? null : cat.id));
    onSelectSubcategory(null);
  };

  const handleSubcategoryPress = (subId: number) => {
    if (disabled) return;
    onSelectSubcategory(subId);
  };

  const expandedCategory = parentCategories.find((c) => c.id === expandedId);
  const subcategories = expandedCategory?.children ?? [];

  return (
    <View className="mt-6">
      <ThemedText className="mb-3 text-xs font-medium tracking-wider uppercase text-brand-grey">
        {t('add.manual.category')}
      </ThemedText>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {parentCategories.map((cat) => {
          const isSelected = expandedId === cat.id;

          return (
            <Pressable
              key={cat.id}
              onPress={() => handleParentPress(cat)}
              disabled={disabled}
              className="justify-center items-center py-1 rounded-xl h-19"
              style={{
                width: '23%',
                backgroundColor: isSelected ? Colors.primary : Colors.white,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <CategoryIcon
                name={getCategoryMaterialIconName(cat.name, 'parent')}
                size={22}
                color={isSelected ? Colors.white : Colors.primary}
              />
              <ThemedText
                className="px-1 mt-1 text-xs font-medium text-center"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: isSelected ? Colors.white : Colors.black }}
              >
                {t(`categories.${cat.name}`, { defaultValue: cat.label })}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {expandedId != null && subcategories.length > 0 && (
        <View className="flex-row flex-wrap mt-4" style={{ gap: 8 }}>
          {subcategories.map((sub) => {
            const isSelected =
              selectedSubcategoryId != null &&
              Number(selectedSubcategoryId) === Number(sub.id);

            return (
              <Pressable
                key={sub.id}
                onPress={() => handleSubcategoryPress(sub.id)}
                disabled={disabled}
                style={{
                  backgroundColor: isSelected ? Colors.primary : Colors.greyLow,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 999,
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: isSelected ? Colors.white : Colors.black,
                  }}
                >
                  {t(`categories.${sub.name}`, { defaultValue: sub.label })}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/Button';
import { ThemedText } from '@/shared/ui/ThemedText';

interface UpgradePromoCardProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onPress: () => void;
}

export function UpgradePromoCard({
  title,
  subtitle,
  ctaLabel,
  onPress,
}: UpgradePromoCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </View>
      <Button variant="primary" onPress={onPress} style={styles.button}>
        {ctaLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderColor: Colors.greyHover,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  textBlock: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.grey,
    lineHeight: 18,
  },
  button: {
    width: '100%',
  },
});

import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

export function ScanReceiptTips() {
  const { t } = useTranslation();

  const tips = [t('add.scan.tip1'), t('add.scan.tip2'), t('add.scan.tip3')];

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {t('add.scan.tipsTitle')}
      </ThemedText>
      {tips.map((text, i) => (
        <View key={i} style={styles.tipRow}>
          <View style={styles.stepBadge}>
            <ThemedText style={styles.stepNumber}>{i + 1}</ThemedText>
          </View>
          <ThemedText style={styles.tipText}>{text}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 4,
    paddingHorizontal: 0,
    color: Colors.primary,
    fontSize: 14,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
    paddingHorizontal: 0,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumber: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 13,
  },
  tipText: {
    flex: 1,
    color: Colors.grey,
    lineHeight: 18,
    fontSize: 13,
  },
});

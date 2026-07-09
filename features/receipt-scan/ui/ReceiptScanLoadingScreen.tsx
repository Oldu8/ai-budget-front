import { useKeepAwake } from 'expo-keep-awake';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { receiptScanStateTokens } from '@/features/receipt-scan/lib/receiptScanStateTokens';
import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/IconSymbol';
import { ThemedText } from '@/shared/ui/ThemedText';

export function ReceiptScanLoadingScreen() {
  // AI scan takes a while — keep the screen on until this screen unmounts.
  useKeepAwake();
  const { t } = useTranslation();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const { ringSize, ringStroke, iconCircleSize, iconInnerSize } =
    receiptScanStateTokens;

  return (
    <View style={styles.center} accessibilityRole="progressbar">
      <View
        style={[styles.ringWrap, { width: ringSize, height: ringSize }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Animated.View
          style={[
            styles.ring,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: ringStroke,
            },
            ringStyle,
          ]}
        />
        <View
          style={[
            styles.iconCircle,
            {
              width: iconCircleSize,
              height: iconCircleSize,
              borderRadius: iconCircleSize / 2,
            },
          ]}
          pointerEvents="none"
        >
          <IconSymbol
            name="receipt.fill"
            size={iconInnerSize}
            color={Colors.primary}
          />
        </View>
      </View>

      <ThemedText
        type="title"
        className="mt-6 text-center text-brand-primary"
        style={styles.title}
      >
        {t('add.receiptScan.processing.title')}
      </ThemedText>
      <ThemedText
        className="text-center text-base text-brand-grey"
        style={styles.subtitle}
      >
        {t('add.receiptScan.processing.subtitle')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderColor: Colors.greyHover,
    borderTopColor: Colors.primary,
  },
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyLow,
  },
  title: {
    paddingHorizontal: receiptScanStateTokens.horizontalPadding,
  },
  subtitle: {
    marginTop: receiptScanStateTokens.titleToSubtitleGap,
    paddingHorizontal: receiptScanStateTokens.horizontalPadding,
  },
});

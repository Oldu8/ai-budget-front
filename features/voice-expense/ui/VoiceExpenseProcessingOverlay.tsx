import React, { useEffect } from 'react';
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

type VoiceExpenseProcessingOverlayProps = {
  title: string;
  subtitle: string;
};

/** Reuses receipt scan loading layout; mic icon for voice processing. */
export function VoiceExpenseProcessingOverlay({
  title,
  subtitle,
}: VoiceExpenseProcessingOverlayProps) {
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
    <Animated.View style={{ flex: 1 }}>
      <Animated.View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Animated.View
          style={[
            {
              width: ringSize,
              height: ringSize,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: ringStroke,
              borderColor: Colors.greyHover,
              borderTopColor: Colors.primary,
              ...ringStyle,
            }}
          />
          <Animated.View
            style={{
              width: iconCircleSize,
              height: iconCircleSize,
              borderRadius: iconCircleSize / 2,
              backgroundColor: Colors.greyLow,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            pointerEvents="none"
          >
            <IconSymbol name="mic.fill" size={iconInnerSize} color={Colors.primary} />
          </Animated.View>
        </Animated.View>
        <ThemedText type="title" className="mt-6 text-center text-brand-primary" style={{ paddingHorizontal: receiptScanStateTokens.horizontalPadding }}>
          {title}
        </ThemedText>
        <ThemedText className="text-base text-center text-brand-grey" style={{ marginTop: receiptScanStateTokens.titleToSubtitleGap, paddingHorizontal: receiptScanStateTokens.horizontalPadding }}>
          {subtitle}
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );
}

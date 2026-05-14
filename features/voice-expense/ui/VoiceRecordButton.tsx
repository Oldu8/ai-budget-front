import React, { useEffect } from 'react';
import {
  Pressable,
  Animated as RNAnimated,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';

import { Colors } from '@/shared/constants/theme';

const SIZE = 88;

interface VoiceRecordButtonProps {
  isRecording: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  label: string;
  onPress: (e: GestureResponderEvent) => void;
}

/** Large circular tap target for voice recording. Pulses subtly while recording. */
export function VoiceRecordButton({
  isRecording,
  disabled,
  accessibilityLabel,
  label,
  onPress,
}: VoiceRecordButtonProps) {
  const pulse = React.useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    if (!isRecording) {
      RNAnimated.timing(pulse, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }

    const loop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulse, {
          toValue: 1.06,
          duration: 700,
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [isRecording, pulse]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.wrap,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <RNAnimated.View
        style={[
          styles.circle,
          { transform: [{ scale: pulse }] },
          disabled && styles.circleDisabled,
        ]}
      >
        <View style={styles.dot} />
      </RNAnimated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  circleDisabled: {
    opacity: 0.45,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    opacity: 0.96,
  },
  captionWrap: {
    marginTop: 12,
    alignSelf: 'center',
    maxWidth: 280,
    paddingHorizontal: 4,
  },
  caption: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey,
  },
});

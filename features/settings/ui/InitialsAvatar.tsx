import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { ThemedText } from '@/shared/ui/ThemedText';

import { getInitials } from '../lib/getInitials';

const SIZE = 72;

export interface InitialsAvatarProps {
  firstName: string | null;
  lastName: string | null;
  size?: number;
}

function InitialsAvatarComponent({
  firstName,
  lastName,
  size = SIZE,
}: InitialsAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const isFallback = initials === 'User';
  const fontSize = isFallback ? size * 0.28 : size * 0.4;
  const lineHeight = fontSize * 1.2;

  const containerStyle = useMemo(
    () => [styles.container, { width: size, height: size, borderRadius: size / 2 }],
    [size]
  );
  const textStyle = useMemo(
    () => [styles.initials, { fontSize, lineHeight }],
    [fontSize, lineHeight]
  );

  return (
    <View style={containerStyle}>
      <ThemedText style={textStyle} numberOfLines={1} adjustsFontSizeToFit>
        {initials}
      </ThemedText>
    </View>
  );
}

export const InitialsAvatar = memo(InitialsAvatarComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

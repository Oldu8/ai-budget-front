import React from 'react';
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

export function InitialsAvatar({
  firstName,
  lastName,
  size = SIZE,
}: InitialsAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const isFallback = initials === 'User';
  const fontSize = isFallback ? size * 0.28 : size * 0.4;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <ThemedText
        style={[styles.initials, { fontSize }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {initials}
      </ThemedText>
    </View>
  );
}

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

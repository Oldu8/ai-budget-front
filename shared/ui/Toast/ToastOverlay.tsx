import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/shared/ui/ThemedText';
import { useToast, type ToastType } from './ToastContext';

const TOAST_AUTO_DISMISS_MS = 2500;

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; border: string; iconColor: string; iconName: keyof typeof MaterialIcons.glyphMap }
> = {
  success: {
    bg: '#dcfce7',
    border: '#86efac',
    iconColor: '#16a34a',
    iconName: 'check-circle',
  },
  error: {
    bg: '#fee2e2',
    border: '#fca5a5',
    iconColor: '#dc2626',
    iconName: 'cancel',
  },
  // TODO: improve loading style
  loading: {
    bg: '#dbeafe',
    border: '#93c5fd',
    iconColor: '#2563eb',
    iconName: 'info',
  },
  message: {
    bg: '#f3f4f6',
    border: '#d1d5db',
    iconColor: '#6b7280',
    iconName: 'info',
  },
};

export function ToastOverlay() {
  const { toast, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  // TODO: add animation with progress bar
  useEffect(() => {
    if (!toast) return;
    if (toast.type === 'loading') return;

    const timer = setTimeout(hideToast, TOAST_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const style = TOAST_STYLES[toast.type];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: style.bg, borderColor: style.border, marginTop: insets.top + 8 },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.content}>
        {toast.type === 'loading' ? (
          <ActivityIndicator size="small" color={style.iconColor} style={styles.icon} />
        ) : (
          <MaterialIcons
            name={style.iconName}
            size={22}
            color={style.iconColor}
            style={styles.icon}
          />
        )}
        <View style={styles.textBlock}>
          <ThemedText style={[styles.title, { color: style.iconColor }]}>
            {toast.title}
          </ThemedText>
          {toast.text ? (
            <ThemedText style={styles.text}>{toast.text}</ThemedText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 9999,
    elevation: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  text: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});

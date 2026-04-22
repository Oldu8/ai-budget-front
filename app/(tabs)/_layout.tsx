import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/shared/constants/theme';
import { HapticTab } from '@/shared/ui/HapticTab';
import { IconSymbol } from '@/shared/ui/IconSymbol';

const TAB_BAR_HEIGHT = 72;

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const tabBarStyle = [
    styles.tabBar,
    Platform.OS === 'ios' && { paddingBottom: insets.bottom, height: TAB_BAR_HEIGHT + insets.bottom },
  ];

  return (
    <Tabs
      screenOptions={{
        /** Only mount the active tab — avoids home API calls while another tab or stack is shown. */
        lazy: true,
        headerShown: true,
        headerStyle: styles.header,
        headerTintColor: Colors.headerText,
        headerTitleStyle: styles.headerTitle,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarItemStyle: { flex: 1 },
        tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.performanceView'),
          tabBarLabel: t('nav.home'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: t('add.title'),
          tabBarLabel: t('nav.add'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="plus.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          /** History uses its own Stack (`history/_layout.tsx`); hide tab header to avoid double bars. */
          /** TODO: это надо проверить, может есть смысл сделать один нормальный хедер, а не отдельный для каждого экрана */
          headerShown: false,
          tabBarLabel: t('nav.history'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="list.bullet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarLabel: t('nav.profile'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.greyHover,
    elevation: 0,
    shadowOpacity: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.background,
  },
  tabBarLabel: {
    fontSize: 12,
  },
});

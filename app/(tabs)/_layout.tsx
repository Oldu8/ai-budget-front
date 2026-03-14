import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { HapticTab } from '@/shared/ui/HapticTab';
import { IconSymbol } from '@/shared/ui/IconSymbol';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarItemStyle: { flex: 1 },
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: t('nav.add'),
          tabBarLabel: '',
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              style={[
                props.style,
                {
                  position: 'absolute',
                  alignSelf: 'center',
                  top: -18,
                },
              ]}
            />
          ),
          tabBarIcon: ({ color }) => (
            <View style={[styles.addButton, { borderColor: color }]}>
              <IconSymbol size={28} name="plus.circle.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 72,
    backgroundColor: Colors.background,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: Colors[theme].background,
          },
          default: {
            backgroundColor: Colors[theme].background,
          },
        }),
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'index':
              iconName = 'house.fill';
              break;
            case 'patients':
              iconName = 'person.2.fill';
              break;
            case 'todo':
              iconName = 'checkmark.circle.fill';
              break;
            case 'alert':
              return <Ionicons name="alert-circle" size={size} color={color} />;
            case 'tools':
              return <Ionicons name="construct-outline" size={size} color={color} />;
            default:
              iconName = '';
          }

          return <IconSymbol size={28} name={iconName} color={color} />;
        },
      })}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="patients" options={{ title: 'Patients' }} />
      <Tabs.Screen name="todo" options={{ title: 'To-Do' }} />
      <Tabs.Screen name="tools" options={{ title: 'Tools' }} />
      <Tabs.Screen name="alert" options={{ title: 'Alert' }} />
    </Tabs>
  );
}

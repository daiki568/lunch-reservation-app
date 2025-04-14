import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { CalendarClock, Settings, User } from 'lucide-react-native';

export default function TabLayout() {
  const isAdmin = useAuthStore((state) => state.isAdmin);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="reservation"
        options={{
          title: '予約する',
          tabBarLabel: '予約',
          tabBarIcon: ({ color, size }) => <CalendarClock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(admin)"
        options={{
          title: '管理者メニュー',
          tabBarLabel: '管理',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          tabBarStyle: isAdmin ? undefined : { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'プロフィール',
          tabBarLabel: 'プロフィール',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
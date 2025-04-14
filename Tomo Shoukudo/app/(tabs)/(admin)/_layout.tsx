import React from 'react';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: '管理者メニュー',
        }}
      />
      <Stack.Screen
        name="menu-management"
        options={{
          title: 'メニュー管理',
        }}
      />
      <Stack.Screen
        name="reservations"
        options={{
          title: '予約一覧',
        }}
      />
    </Stack>
  );
}
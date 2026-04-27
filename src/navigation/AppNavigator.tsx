// src/navigation/AppNavigator.tsx
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ShareScreen from '../screens/ShareScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0A0C0F',
    card: '#111418',
    text: '#E8EDF5',
    border: '#1A1F28',
    primary: '#00FF88',
    notification: '#00FF88',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={darkTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111418',
            borderTopColor: '#1A1F28',
            borderTopWidth: 0.5,
            paddingBottom: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#00FF88',
          tabBarInactiveTintColor: '#6B7280',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }}
        />
        <Tab.Screen
          name="Amigos"
          component={FriendsScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👥</Text> }}
        />
        <Tab.Screen
          name="Compartilhar"
          component={ShareScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚡</Text> }}
        />
        <Tab.Screen
          name="Recebidos"
          component={InboxScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📥</Text> }}
        />
        <Tab.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
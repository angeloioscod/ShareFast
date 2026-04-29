import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ShareScreen from '../screens/ShareScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OfflineScreen from '../screens/OfflineScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator({ usuario, onLogout }: { usuario: any, onLogout: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111418',
          borderTopColor: '#1A1F28',
          borderTopWidth: 0.5,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#00FF88',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: 'bold',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      >
        {() => <HomeScreen usuario={usuario} />}
      </Tab.Screen>


      <Tab.Screen
        name="Amigos"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Compartilhar"
        component={ShareScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⚡</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Recebidos"
        component={InboxScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      >
        {() => <ProfileScreen usuario={usuario} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Offline"
        component={OfflineScreen}
        options={{
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}
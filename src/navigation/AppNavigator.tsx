import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

function MyTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  const icons: Record<string, string> = {
    Home: '🏠',
    Amigos: '👥',
    Compartilhar: '⚡',
    Recebidos: '📥',
    Perfil: '👤',
  };

  return (
    <React.Fragment>
      <React.Fragment>
        {/* Barra customizada que respeita a safe area */}
        <React.Fragment>
          <Text style={{ display: 'none' }} />
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Text
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: insets.bottom,
              }}
            >
              {icons[route.name]}
            </Text>
          );
        })}
      </React.Fragment>
    </React.Fragment>
  );
}

export default function AppNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer theme={darkTheme}>
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
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
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
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
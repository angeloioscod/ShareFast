import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/services/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { criarPerfilSeNaoExistir } from './src/services/auth';

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

export default function App() {
  const [logado, setLogado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await criarPerfilSeNaoExistir(user);
        setUsuario(user);
        setLogado(true);
      } else {
        setUsuario(null);
        setLogado(false);
      }
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  if (carregando) return null;

  if (!logado) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLogin={() => setLogado(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={darkTheme}>
        <AppNavigator usuario={usuario} onLogout={() => signOut(auth)} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
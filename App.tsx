import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { StatusBar } from 'expo-status-bar'
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import { useAuth } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { Routes } from './src/routes'

import { AuthProvider } from './src/hooks/auth';

export default function App() {
  const { userStorageLoading } = useAuth()
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded && !userStorageLoading){
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
        <StatusBar style="light"/>
        <AuthProvider>
          <Routes />
        </AuthProvider>
    </ThemeProvider>
  )
}

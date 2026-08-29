/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen, OnboardingScreen, HomeScreen } from './src/screens';

type Screen = 'splash' | 'onboarding' | 'home';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('home');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'splash' && (
        <SplashScreen onSplashComplete={handleSplashComplete} />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'home' && <HomeScreen />}
    </SafeAreaProvider>
  );
}

export default App;

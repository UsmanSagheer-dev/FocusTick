/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  SplashScreen,
  OnboardingScreen,
} from './src/screens';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';

type Screen = 'splash' | 'onboarding' | 'main';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('main');
  };

  return (
    <SafeAreaProvider>
      <TaskProvider>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      {currentScreen === 'splash' && (
        <SplashScreen onSplashComplete={handleSplashComplete} />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'main' && <AppNavigator />}
      </TaskProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    flex: 1,
  },
});

export default App;

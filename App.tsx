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
  HomeScreen,
  TasksScreen,
  AnalyticsScreen,
  SettingsScreen,
} from './src/screens';
import BottomNavigation from './src/common/BottomNavigation';

type Screen = 'splash' | 'onboarding' | 'main';
type TabType = 'home' | 'tasks' | 'analytics' | 'settings';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleSplashComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('main');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      {currentScreen === 'splash' && (
        <SplashScreen onSplashComplete={handleSplashComplete} />
      )}
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'main' && (
        <View style={styles.mainContainer}>
          <View style={styles.content}>{renderMainContent()}</View>
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </View>
      )}
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

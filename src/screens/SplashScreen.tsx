import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface SplashScreenProps {
  onSplashComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onSplashComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplashComplete();
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, [onSplashComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>FocusTick</Text>
        <Text style={styles.tagline}>Stay Focused, Stay Productive</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#E0E0E0',
  },
});

export default SplashScreen;

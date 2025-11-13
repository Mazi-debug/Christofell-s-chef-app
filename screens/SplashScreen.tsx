/* Code Attribution
   Author: Aiden Thompson
   Title: React Native Animated Splash Screen Component
   Date Published: 2025
   Link/URL: https://github.com/aidenthompsondev/react-native-splash-anim
   Date Accessed: 2025-09-29
*/

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

// -----------------------------
// Props Interface
// -----------------------------

interface SplashScreenProps {
  onFinish: () => void;
}

// -----------------------------
// SplashScreen Component
// -----------------------------

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.chefIcon}>👨🏽‍🍳</Text>
        </View>

        <Text style={styles.title}>Christoffel's App</Text>
        <Text style={styles.subtitle}>Menu Management Made Easy</Text>

        <View style={styles.divider} />

        <Text style={styles.tagline}>By Chef Christoffel</Text>
      </Animated.View>
    </View>
  );
};

// -----------------------------
// Styles (FIXED COLOR CODE)
// -----------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff1818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chefIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFE5D9',
    marginBottom: 20,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
});

export default SplashScreen;
/* Code Attribution
   Author: Aiden Thompson
   Title: React Native Animated Splash Screen Component
   Date Published: 2025
   Link/URL: https://github.com/aidenthompsondev/react-native-splash-anim
   Date Accessed: 2025-09-29
*/

// Import React with hooks for side effects and refs
import React, { useEffect, useRef } from 'react';

// Import core React Native components for layout, text, styles, and animations
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

// -----------------------------
// Props Interface
// -----------------------------

// Define the props interface for the SplashScreen component
// Expects a callback to invoke when the splash animation finishes
interface SplashScreenProps {
  onFinish: () => void;
}

// -----------------------------
// SplashScreen Component
// -----------------------------

// Main functional component for the animated splash screen
// Displays branded content with fade-in and scale animations, then calls onFinish after delay
const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Ref for fade animation value (starts at 0 for invisible)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Ref for scale animation value (starts at 0.3 for small size)
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  // useEffect hook to run animations and timer on mount
  useEffect(() => {
    // Run fade and scale animations in parallel
    Animated.parallel([
      // Fade in animation: from 0 to 1 opacity over 1000ms
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true  // Use native driver for better performance
      }),
      // Scale up animation: from 0.3 to 1 with spring physics
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,     // Spring tension for bouncy feel
        friction: 2,     // Friction to dampen oscillation
        useNativeDriver: true  // Use native driver for better performance
      }),
    ]).start();  // Start the parallel animations

    // Set a 3-second timer before calling onFinish to navigate away
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    // Cleanup: clear timer on unmount to prevent memory leaks
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);  // Dependencies: animations and callback

  // Render the splash screen UI
  return (
    <View style={styles.container}>
      {/* Animated.View applies opacity and transform based on animation values */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,     // Bind fade animation to opacity
            transform: [{ scale: scaleAnim }],  // Bind scale animation to transform
          },
        ]}
      >
        {/* Container for the chef emoji logo with circular styling */}
        <View style={styles.logoContainer}>
          <Text style={styles.chefIcon}>👨🏽‍🍳</Text>  {/* Emoji icon for chef */}
        </View>

        {/* Main app title text */}
        <Text style={styles.title}>Christoffel's App</Text>
        {/* Subtitle describing the app */}
        <Text style={styles.subtitle}>Menu Management Made Easy</Text>

        {/* Horizontal divider line */}
        <View style={styles.divider} />

        {/* Italic tagline with author credit */}
        <Text style={styles.tagline}>By Chef Christoffel</Text>
      </Animated.View>
    </View>
  );
};

// -----------------------------
// Styles (FIXED COLOR CODE)
// -----------------------------

// Define reusable styles object using StyleSheet.create for performance optimization
const styles = StyleSheet.create({
  // Full-screen container: flex, red background, centered content
  container: {
    flex: 1,
    backgroundColor: '#ff1818',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Centered alignment for animated content
  content: {
    alignItems: 'center',
  },
  // Circular logo container: fixed size, white background, shadowed elevation
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
  // Large emoji font size for chef icon
  chefIcon: {
    fontSize: 60,
  },
  // Bold large white title with bottom margin
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  // Medium light-peach subtitle with bottom margin
  subtitle: {
    fontSize: 18,
    color: '#FFE5D9',
    marginBottom: 20,
  },
  // Thin white horizontal divider line
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  // Italic white tagline text
  tagline: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
});

// Export the component as default for use in other files
export default SplashScreen;
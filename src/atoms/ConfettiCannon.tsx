import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

interface ConfettiProps {
  count?: number;
  origin?: { x: number; y: number };
  autoStart?: boolean;
  fadeOut?: boolean;
  fallSpeed?: number;
  explosionSpeed?: number;
  colors?: string[];
  duration?: number; // Added duration prop to fix TypeScript error
  // Note: The library doesn't support a size prop
  // It uses random sizes internally (8-16px width, 6-12px height)
}

export const Confetti: React.FC<ConfettiProps> = ({
  count = 100,
  origin,
  autoStart = true,
  fadeOut = true,
  fallSpeed = 3000,
  explosionSpeed = 350,
  colors,
  duration,
}) => {
  const theme = useTheme<AppTheme>();
  const confettiRef = useRef<ConfettiCannon>(null);

  // Default colors if none provided
  const defaultColors = colors || [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.error,
    '#FFC107', // amber
    '#FF9800', // orange
    '#9C27B0', // purple
  ];

  // Calculate default origin if not provided
  const defaultOrigin = origin || {
    x: -10, // Slightly off-screen to the left
    y: 0,   // Top of the screen
  };

  // Start the animation when the component mounts if autoStart is true
  useEffect(() => {
    if (autoStart && confettiRef.current) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        confettiRef.current?.start();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={count}
        origin={defaultOrigin}
        fadeOut={fadeOut}
        fallSpeed={fallSpeed}
        explosionSpeed={explosionSpeed}
        colors={defaultColors}
        autoStart={false} // We'll handle starting manually in useEffect
        // Pass duration to the underlying component if provided
        {...(duration !== undefined && { duration })}
        // Note: particleSize prop doesn't exist in the library
        // The library uses random sizes internally
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
});
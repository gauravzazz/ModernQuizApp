import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

interface ConfettiProps {
  count?: number;
  colors?: string[];
  duration?: number;
  fadeOut?: boolean;
  autoStart?: boolean;
}

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
}

export const Confetti: React.FC<ConfettiProps> = ({
  count = 50,
  colors,
  duration = 5000,
  fadeOut = true,
  autoStart = true,
}) => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const confettiPieces = useRef<ConfettiPiece[]>([]);
  
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

  // Initialize confetti pieces
  useEffect(() => {
    confettiPieces.current = Array(count)
      .fill(0)
      .map((_, i) => {
        const size = Math.random() * 10 + 5; // Random size between 5-15
        return {
          id: i,
          x: new Animated.Value(Math.random() * screenWidth),
          y: new Animated.Value(-20 - Math.random() * 100),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(Math.random() * 0.5 + 0.5),
          opacity: new Animated.Value(1),
          color: defaultColors[Math.floor(Math.random() * defaultColors.length)],
          size,
        };
      });

    if (autoStart) {
      startAnimation();
    }

    return () => {
      // Cleanup animations if needed
    };
  }, []);

  const startAnimation = () => {
    const animations = confettiPieces.current.map((piece) => {
      const xDestination = piece.x._value + (Math.random() * 200 - 100);
      const yDestination = screenHeight + 50;
      const rotationDestination = Math.random() * 10 * 360; // Multiple full rotations

      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: yDestination,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(piece.x, {
          toValue: xDestination,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotation, {
          toValue: rotationDestination,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        fadeOut
          ? Animated.sequence([
              Animated.delay(duration * 0.7),
              Animated.timing(piece.opacity, {
                toValue: 0,
                duration: duration * 0.3,
                useNativeDriver: true,
              }),
            ])
          : Animated.delay(0),
      ]);
    });

    Animated.stagger(50, animations).start();
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece) => {
        const rotateStyle = {
          transform: [
            { translateX: piece.x },
            { translateY: piece.y },
            { rotate: piece.rotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            })},
            { scale: piece.scale },
          ],
          opacity: piece.opacity,
        };

        return (
          <Animated.View
            key={piece.id}
            style={[styles.confetti, rotateStyle, { backgroundColor: piece.color, width: piece.size, height: piece.size * 0.6 }]}
          />
        );
      })}
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
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});
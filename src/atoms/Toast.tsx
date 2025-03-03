import React, { useEffect } from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';

export interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss?: () => void;
  style?: ViewStyle;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  style,
  visible,
}) => {
  const theme = useTheme<AppTheme>();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    }
  }, [visible, duration, opacity, onDismiss]);

  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.primary;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return '#FFA726';
      default:
        return theme.colors.secondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: getBackgroundColor(),
      borderRadius: theme.roundness,
      padding: 16,
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }, style]}>
      <Typography variant="body2" color="onPrimary" align="center">
        {message}
      </Typography>
    </Animated.View>
  );
};
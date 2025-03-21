import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

export type NavigationButtonVariant = 'left' | 'right' | 'close' | 'menu' | 'filter';

export interface NavigationButtonProps {
  variant: NavigationButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  size?: number;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  variant,
  onPress = () => {},
  disabled = false,
  style,
  size = 48,
}) => {
  const theme = useTheme<AppTheme>();

  const getIcon = () => {
    switch (variant) {
      case 'left':
        return '←';
      case 'right':
        return '→';
      case 'close':
        return '×';
      case 'menu':
        return '☰';
      case 'filter':
        return '⚡';
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    button: {
      width: size,
      height: size,
      borderRadius: size / 2, // Make it round
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      opacity: disabled ? 0.5 : 1,
    },
    icon: {
      fontSize: variant === 'close' ? 28 : 24,
      color: theme.colors.onSurface,
      //fontWeight: 'bold',
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
    </TouchableOpacity>
  );
};
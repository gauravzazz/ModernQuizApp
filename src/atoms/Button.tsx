import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  isThemeToggle?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  loading = false,
  disabled = false,
  fullWidth = false,
  isThemeToggle = false,
  style,
  children,
  ...props
}) => {
  const theme = useTheme<AppTheme>();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceVariant;
    if (isThemeToggle) return theme.colors.neuPrimary;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.onSurfaceVariant;
    if (isThemeToggle) return theme.colors.onSurface;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.onPrimary;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.onPrimary;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: disabled ? theme.colors.surfaceVariant : theme.colors.primary,
      };
    }
    return {};
  };

  const styles = StyleSheet.create({
    button: {
      ...getPadding(),
      backgroundColor: getBackgroundColor(),
      borderRadius: theme.roundness,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      width: fullWidth ? '100%' : 'auto',
      opacity: loading ? 0.7 : 1,
      ...getBorderStyle(),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 10,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      transform: [{ scale: 1 }],
    },
    text: {
      color: getTextColor(),
      fontWeight: '600',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      textShadowColor: isThemeToggle ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      letterSpacing: 0.5,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={disabled || loading}
      {...props}
    >
      {label ? <Text style={styles.text}>{label}</Text> : children}
    </TouchableOpacity>
  );
};
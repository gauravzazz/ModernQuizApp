import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing, scaledFontSize, scaledRadius } from '../utils/scaling';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neumorphic';
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
  const [isPressed, setIsPressed] = useState(false);

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
      case 'neumorphic':
        return theme.colors.neuPrimary;
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
      case 'neumorphic':
        return theme.colors.onSurface;
      default:
        return theme.colors.onPrimary;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: scaledSpacing(8), paddingHorizontal: scaledSpacing(16) };
      case 'large':
        return { paddingVertical: scaledSpacing(16), paddingHorizontal: scaledSpacing(32) };
      default:
        return { paddingVertical: scaledSpacing(12), paddingHorizontal: scaledSpacing(24) };
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: moderateScale(2),
        borderColor: disabled ? theme.colors.surfaceVariant : theme.colors.primary,
      };
    } else if (variant === 'neumorphic') {
      return { borderWidth: 0 }; // No border for neumorphic style
    }
    return {};
  };

  const shadowStyle = variant === 'neumorphic'
    ? isPressed
      ? {
          shadowColor: theme.colors.neuLight,
          shadowOffset: { width: -moderateScale(2), height: -moderateScale(2) },
          shadowOpacity: 0.5,
          shadowRadius: moderateScale(4),
          elevation: moderateScale(2),
        }
      : {
          shadowColor: theme.colors.neuDark,
          shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
          shadowOpacity: 0.5,
          shadowRadius: moderateScale(4),
          elevation: moderateScale(5),
        }
    : {
        shadowColor: theme.colors.neuDark,
        shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
        shadowOpacity: 1,
        shadowRadius: moderateScale(10),
        elevation: moderateScale(10),
      };

  const styles = StyleSheet.create({
    button: {
      ...getPadding(),
      backgroundColor: getBackgroundColor(),
      borderRadius: scaledRadius(theme.roundness),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      width: fullWidth ? '100%' : 'auto',
      opacity: loading ? 0.7 : 1,
      ...getBorderStyle(),
      ...shadowStyle,
    },
    text: {
      color: getTextColor(),
      fontWeight: '600',
      fontSize: scaledFontSize(size === 'small' ? 14 : size === 'large' ? 18 : 16),
      textShadowColor: isThemeToggle ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(1),
      letterSpacing: moderateScale(0.5),
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, { transform: [{ scale: isPressed ? 0.98 : 1 }] }, style]}
      disabled={disabled || loading}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...props}
    >
      {label ? <Text style={styles.text}>{label}</Text> : children}
    </TouchableOpacity>
  );
};
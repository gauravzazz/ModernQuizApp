import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: any;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      width: 52,
      height: 32,
      borderRadius: 16,
      padding: 2,
      backgroundColor: theme.colors.neuPrimary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    track: {
      width: '100%',
      height: '100%',
      borderRadius: 14,
      backgroundColor: value ? theme.colors.primary : 'transparent',
    },
    thumb: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.neuPrimary,
      top: 3,
      left: value ? 24 : 4,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.track} />
      <View style={styles.thumb} />
    </TouchableOpacity>
  );
};
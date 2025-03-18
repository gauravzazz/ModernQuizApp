import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, scaledSpacing, scaledFontSize, scaledRadius } from '../utils/scaling';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  fullWidth = false,
  style,
  ...props
}) => {
  const theme = useTheme<AppTheme>();
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      width: fullWidth ? '100%' : 'auto',
    },
    label: {
      marginBottom: scaledSpacing(4),
    },
    inputContainer: {
      borderRadius: scaledRadius(theme.roundness),
      padding: scaledSpacing(12),
    },
    input: {
      color: theme.colors.onSurface,
      fontSize: scaledFontSize(16),
      padding: 0,
      backgroundColor: 'transparent',
    },
    helper: {
      marginTop: scaledSpacing(4),
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography
          variant="body2"
          color="onSurfaceVariant"
          style={styles.label}
        >
          {label}
        </Typography>
      )}
      <LinearGradient
        colors={[theme.colors.neuLight, theme.colors.neuDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </LinearGradient>
      {(error || helper) && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'onSurfaceVariant'}
          style={styles.helper}
        >
          {error || helper}
        </Typography>
      )}
    </View>
  );
};
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';

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

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.surfaceVariant;
  };

  const styles = StyleSheet.create({
    container: {
      width: fullWidth ? '100%' : 'auto',
    },
    label: {
      marginBottom: 4,
    },
    inputContainer: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: getBorderColor(),
      borderRadius: theme.roundness,
      padding: 12,
    },
    input: {
      color: theme.colors.onSurface,
      fontSize: 16,
      padding: 0,
    },
    helper: {
      marginTop: 4,
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
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
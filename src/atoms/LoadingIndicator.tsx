import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large' | number;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  size,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size || 'large'} color={theme.colors.primary} />
      <Typography variant="body1" style={styles.message}>
        {message}
      </Typography>
    </View>
  );
};
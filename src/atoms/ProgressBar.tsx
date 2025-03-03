import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

export interface ProgressBarProps {
  progress: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  style,
}) => {
  const theme = useTheme<AppTheme>();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 10,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: 5,
      overflow: 'hidden',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      position: 'relative',
    },
    progress: {
      height: '100%',
      width: `${clampedProgress * 100}%`,
      backgroundColor: theme.colors.primary,
      borderRadius: 5,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.progress} />
    </View>
  );
};
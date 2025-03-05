import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, scaledRadius } from '../utils/scaling';

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
      height: moderateScale(10),
      borderRadius: scaledRadius(5),
      overflow: 'hidden',
      flexDirection: 'row',
    },
    progress: {
      height: '100%',
      width: `${clampedProgress * 100}%`,
      backgroundColor: theme.colors.primary,
    },
    remaining: {
      height: '100%',
      width: `${(1 - clampedProgress) * 100}%`,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.progress} />
      <LinearGradient
        colors={[theme.colors.neuLight, theme.colors.neuDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.remaining}
      />
    </View>
  );
};
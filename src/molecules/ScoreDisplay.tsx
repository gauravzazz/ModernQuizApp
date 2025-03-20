import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { moderateScale, scaledSpacing, scaledFontSize, scaledRadius } from '../utils/scaling';

interface ScoreDisplayProps {
  score: {
    points: number;
    total: number;
    percentage: number;
  };
  modalScaleAnim: Animated.Value;
  modalOpacityAnim: Animated.Value;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  modalScaleAnim,
  modalOpacityAnim,
}) => {
  const theme = useTheme<AppTheme>();
  
  const styles = StyleSheet.create({
    scoreContainer: {
      width: '90%',
      marginTop: scaledSpacing(0),
      marginBottom: scaledSpacing(24),
      padding: scaledSpacing(20),
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness),
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
    },
    scoreTitle: {
      fontSize: scaledFontSize(16),
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: scaledSpacing(12),
    },
    scoreValue: {
      fontSize: scaledFontSize(28),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(8),
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
    },
    scorePercentage: {
      fontSize: scaledFontSize(10),
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
    },
  });

  if (!score) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.scoreContainer, 
        {
          transform: [{ scale: modalScaleAnim }],
          opacity: modalOpacityAnim
        }
      ]}
    >
      <Typography variant="h3" style={styles.scoreTitle}>Your Score</Typography>
      <Typography variant="h1" style={styles.scoreValue}>
        {score.points}/{score.total}
      </Typography>
      <Typography variant="body1" style={styles.scorePercentage}>
        {score.percentage}% Correct
      </Typography>
    </Animated.View>
  );
};
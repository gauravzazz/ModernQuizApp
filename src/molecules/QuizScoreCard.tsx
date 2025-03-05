import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

interface QuizScoreCardProps {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  totalQuestions: number;
  accuracy: number;
  totalTime: number;
  avgTimePerQuestion: number;
}

export const QuizScoreCard: React.FC<QuizScoreCardProps> = ({
  score,
  correctAnswers,
  incorrectAnswers,
  skippedAnswers,
  totalQuestions,
  accuracy,
  totalTime,
  avgTimePerQuestion,
}) => {
  const theme = useTheme<AppTheme>();
  
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);

  const styles = StyleSheet.create({
    resultCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 24,
      marginBottom: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
      flexWrap: 'wrap',
    },
    statItem: {
      alignItems: 'center',
      minWidth: 80,
      margin: 8,
    },
    scoreText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    scoreLabel: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.resultCard}>
      <View style={styles.scoreContainer}>
        <Typography style={styles.scoreText}>{score}%</Typography>
        <Typography style={styles.scoreLabel}>
          {score >= 70 ? 'Great job!' : score >= 40 ? 'Good effort!' : 'Keep practicing!'}
        </Typography>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Typography variant="h6" color="success">
            {correctAnswers}
          </Typography>
          <Typography variant="caption">Correct</Typography>
        </View>

        <View style={styles.statItem}>
          <Typography variant="h6" color="error">
            {incorrectAnswers}
          </Typography>
          <Typography variant="caption">Incorrect</Typography>
        </View>

        <View style={styles.statItem}>
          <Typography variant="h6" color="warning">
            {skippedAnswers}
          </Typography>
          <Typography variant="caption">Skipped</Typography>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="target" size={24} color={theme.colors.primary} />
          <Typography variant="h6" style={{marginTop: 4}}>
            {accuracy}%
          </Typography>
          <Typography variant="caption">Accuracy</Typography>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
          <Typography variant="h6" style={{marginTop: 4}}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Typography>
          <Typography variant="caption">Total Time</Typography>
        </View>

        <View style={styles.statItem}>
          <MaterialCommunityIcons name="timer-outline" size={24} color={theme.colors.primary} />
          <Typography variant="h6" style={{marginTop: 4}}>
            {avgTimePerQuestion.toFixed(1)}s
          </Typography>
          <Typography variant="caption">Avg Time/Q</Typography>
        </View>
      </View>
    </View>
  );
};
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { SearchBar } from '../atoms/SearchBar';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../atoms/ProgressBar';

interface QuizAttempt {
  id: string;
  subject: string;
  quiz: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: string;
  date: string;
}

const mockAttempts: QuizAttempt[] = [
  {
    id: '1',
    subject: 'Mathematics',
    quiz: 'Basic Algebra',
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    timeTaken: '15:30',
    date: '2023-12-01',
  },
  {
    id: '2',
    subject: 'Science',
    quiz: 'Chemistry Basics',
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    timeTaken: '18:45',
    date: '2023-12-02',
  },
];

export const QuizHistoryScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    searchContainer: {
      marginBottom: 24,
    },
    historyCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    metadata: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    scoreContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.roundness,
      padding: 12,
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressContainer: {
      flex: 1,
      marginRight: 16,
    },
    scoreText: {
      minWidth: 80,
      textAlign: 'right',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" weight="bold">
          Quiz History
        </Typography>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar placeholder="Search history..." />
      </View>
      <ScrollView>
        {mockAttempts.map((attempt) => (
          <View key={attempt.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <Typography variant="h6" weight="bold">
                {attempt.quiz}
              </Typography>
              <Typography variant="caption" color="onSurfaceVariant">
                {attempt.date}
              </Typography>
            </View>
            <Typography variant="body2" color="onSurfaceVariant">
              {attempt.subject}
            </Typography>
            <View style={styles.scoreContainer}>
              <View style={styles.progressContainer}>
                <ProgressBar progress={attempt.score / 100} />
              </View>
              <Typography
                variant="h6"
                weight="bold"
                color="primary"
                style={styles.scoreText}
              >
                {attempt.score}%
              </Typography>
            </View>
            <View style={styles.metadata}>
              <Typography variant="caption" color="onSurfaceVariant">
                {attempt.correctAnswers}/{attempt.totalQuestions} Correct
              </Typography>
              <Typography variant="caption" color="onSurfaceVariant">
                Time: {attempt.timeTaken}
              </Typography>
            </View>
            <View style={styles.actions}>
              <Button
                label="View Details"
                variant="outline"
                size="small"
                onPress={() => {}}
              />
              <Button
                label="Retry Quiz"
                size="small"
                onPress={() => {}}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
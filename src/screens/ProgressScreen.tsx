import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';

interface SubjectProgress {
  id: string;
  subject: string;
  completedQuizzes: number;
  totalQuizzes: number;
  averageScore: number;
  streak: number;
}

const mockProgress: SubjectProgress[] = [
  {
    id: '1',
    subject: 'Mathematics',
    completedQuizzes: 12,
    totalQuizzes: 15,
    averageScore: 85,
    streak: 3,
  },
  {
    id: '2',
    subject: 'Science',
    completedQuizzes: 15,
    totalQuizzes: 20,
    averageScore: 92,
    streak: 5,
  },
  {
    id: '3',
    subject: 'History',
    completedQuizzes: 8,
    totalQuizzes: 12,
    averageScore: 78,
    streak: 2,
  },
];

export const ProgressScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();

  const totalQuizzesTaken = mockProgress.reduce(
    (sum, subject) => sum + subject.completedQuizzes,
    0
  );

  const averageOverallScore =
    mockProgress.reduce((sum, subject) => sum + subject.averageScore, 0) /
    mockProgress.length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    overviewContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
    },
    overviewCard: {
      flex: 1,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 16,
      marginHorizontal: 6,
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    subjectCard: {
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
    subjectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    streakBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" weight="bold">
          Your Progress
        </Typography>
      </View>

      <View style={styles.overviewContainer}>
        <View style={styles.overviewCard}>
          <Typography variant="h5" weight="bold" color="primary">
            {totalQuizzesTaken}
          </Typography>
          <Typography variant="caption" color="onSurfaceVariant">
            Quizzes Taken
          </Typography>
        </View>
        <View style={styles.overviewCard}>
          <Typography variant="h5" weight="bold" color="primary">
            {averageOverallScore.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="onSurfaceVariant">
            Average Score
          </Typography>
        </View>
      </View>

      <ScrollView>
        {mockProgress.map((subject) => (
          <View key={subject.id} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <Typography variant="h6" weight="bold">
                {subject.subject}
              </Typography>
              {subject.streak > 0 && (
                <View style={styles.streakBadge}>
                  <Typography variant="caption" color="onPrimary">
                    {subject.streak} Day Streak 🔥
                  </Typography>
                </View>
              )}
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={subject.completedQuizzes / subject.totalQuizzes}
              />
              <View style={styles.progressStats}>
                <Typography variant="caption" color="onSurfaceVariant">
                  {subject.completedQuizzes}/{subject.totalQuizzes} Quizzes
                </Typography>
                <Typography variant="caption" color="primary">
                  Avg: {subject.averageScore}%
                </Typography>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
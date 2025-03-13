import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { NavigationButton } from '../atoms/NavigationButton';
import { granularAnalyticsService } from '../services/granularAnalyticsService';
import { LoadingIndicator } from '../atoms/LoadingIndicator';
import { LineChart } from 'react-native-chart-kit';
import { moderateScale, scaledSpacing, scaledRadius } from '../utils/scaling';

interface WeeklyProgress {
  dates: string[];
  scores: number[];
  quizzesTaken: number[];
}

export const ProgressScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [subjectsAnalytics, setSubjectsAnalytics] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyProgress>({ dates: [], scores: [], quizzesTaken: [] });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const subjects = await granularAnalyticsService.getAllSubjectsAnalytics();
      setSubjectsAnalytics(subjects);

      const weeklyData = await granularAnalyticsService.getWeeklyStats();
      const weeklyProgress: WeeklyProgress = {
        dates: [],
        scores: [],
        quizzesTaken: []
      };

      weeklyData.forEach(day => {
        weeklyProgress.dates.push(day.date.split('-')[2]); // Only show day
        weeklyProgress.quizzesTaken.push(day.quizzesTaken);
        const dayScore = day.questionsAnswered > 0 
          ? (day.correctAnswers / day.questionsAnswered) * 100 
          : 0;
        weeklyProgress.scores.push(Math.round(dayScore));
      });

      setWeeklyStats(weeklyProgress);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalQuizzesTaken = subjectsAnalytics.reduce(
    (sum, subject) => sum + subject.completedQuizzes,
    0
  );

  const averageOverallScore =
    subjectsAnalytics.reduce((sum, subject) => sum + subject.averageScore, 0) /
    (subjectsAnalytics.length || 1);

  const screenWidth = Dimensions.get('window').width - 32;

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => `rgba(${theme.dark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 24,
      paddingVertical: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 8,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    content: {
      flex: 1,
      padding: 16,
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
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: scaledSpacing(16),
      marginBottom: scaledSpacing(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
      shadowOpacity: 1,
      shadowRadius: moderateScale(10),
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    subjectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaledSpacing(12),
    },
    progressContainer: {
      marginTop: scaledSpacing(8),
    },
    progressStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scaledSpacing(8),
    },
    streakBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    chartContainer: {
      marginVertical: 24,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    chartTitle: {
      marginBottom: 16,
      textAlign: 'center',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
  });

  if (isLoading) {
    return <LoadingIndicator message="Loading your progress..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerNav}>
        <View style={styles.headerTitle}>
          <NavigationButton variant="left" onPress={() => navigation.goBack()} />
          <Typography variant="h6" weight="bold">
            📊 Your Progress
          </Typography>
        </View>
      </View>

      <ScrollView style={styles.content}>
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

        {weeklyStats.dates.length > 0 && (
          <View style={styles.chartContainer}>
            <Typography variant="h6" weight="bold" style={styles.chartTitle}>
              Weekly Performance
            </Typography>
            <LineChart
              data={{
                labels: weeklyStats.dates,
                datasets: [
                  {
                    data: weeklyStats.scores,
                    color: (opacity = 1) => theme.colors.primary,
                    strokeWidth: 2
                  }
                ]
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16
              }}
            />
          </View>
        )}

        {subjectsAnalytics.length > 0 ? (
          subjectsAnalytics.map((subject) => (
            <View key={subject.subjectId} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Typography variant="h6" weight="bold">
                  {subject.title}
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
                  progress={subject.masteryLevel}
                />
                <View style={styles.progressStats}>
                  <Typography variant="caption" color="onSurfaceVariant">
                    {subject.completedQuizzes} Quizzes Completed
                  </Typography>
                  <Typography variant="caption" color="primary">
                    Avg: {subject.averageScore.toFixed(1)}%
                  </Typography>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Typography variant="h6" weight="bold" style={{ marginBottom: 8 }}>
              No Progress Yet
            </Typography>
            <Typography variant="body1" style={{ textAlign: 'center' }}>
              Start taking quizzes to track your progress and see your improvement over time.
            </Typography>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
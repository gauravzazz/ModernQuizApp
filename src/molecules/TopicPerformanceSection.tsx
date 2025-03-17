import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing, verticalScale } from '../utils/scaling';
import { TopicAnalytics } from '../services/quizResultService';

interface TopicPerformanceSectionProps {
  topics: TopicAnalytics[];
}

export const TopicPerformanceSection: React.FC<TopicPerformanceSectionProps> = ({
  topics,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      marginBottom: scaledSpacing(16),
    },
    progressItem: {
      marginBottom: scaledSpacing(16),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 1.2,
      padding: moderateScale(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.25,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(5),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
    },
    progressLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(8),
      alignItems: 'center',
    },
    progressBarContainer: {
      marginBottom: verticalScale(6),
      height: moderateScale(8),
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: moderateScale(4),
      overflow: 'hidden',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scaledSpacing(8),
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: scaledSpacing(24),
    },
  });

  if (topics.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Typography>No topic data available for the selected time period.</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {topics.map((topic) => (
        <View key={topic.id} style={styles.progressItem}>
          <View style={styles.progressLabel}>
            <Typography weight="bold">{topic.title}</Typography>
            <Typography weight="bold">{Math.round(topic.averageScore)}%</Typography>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={topic.averageScore / 100} />
          </View>
          <View style={styles.statsRow}>
            <Typography variant="caption">{topic.totalQuizzes} quizzes</Typography>
            <Typography variant="caption">{Math.round(topic.averageTimePerQuestion / 1000)}s avg. time</Typography>
          </View>
        </View>
      ))}
    </View>
  );
};
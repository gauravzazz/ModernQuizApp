import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing } from '../utils/scaling';

interface PerformanceOverviewProps {
  totalQuizzes: number;
  accuracy: number;
  streak: number;
  averageScore: number;
}

export const PerformanceOverviewSection: React.FC<PerformanceOverviewProps> = ({
  totalQuizzes,
  accuracy,
  streak,
  averageScore,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: scaledSpacing(16),
    },
    statCard: {
      width: '48%',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: scaledSpacing(16),
      marginBottom: scaledSpacing(16),
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    statValue: {
      fontSize: moderateScale(24),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginVertical: scaledSpacing(8),
    },
    statLabel: {
      fontSize: moderateScale(14),
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: scaledSpacing(24),
    },
  });

  return (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <MaterialCommunityIcons
          name="book-open-variant"
          size={moderateScale(28)}
          color={theme.colors.primary}
        />
        <Typography style={styles.statValue}>{totalQuizzes}</Typography>
        <Typography style={styles.statLabel}>Quizzes Taken</Typography>
      </View>
      
      <View style={styles.statCard}>
        <MaterialCommunityIcons
          name="target"
          size={moderateScale(28)}
          color={theme.colors.primary}
        />
        <Typography style={styles.statValue}>{accuracy}%</Typography>
        <Typography style={styles.statLabel}>Accuracy</Typography>
      </View>
      
      <View style={styles.statCard}>
        <MaterialCommunityIcons
          name="fire"
          size={moderateScale(28)}
          color={theme.colors.warning}
        />
        <Typography style={styles.statValue}>{streak}</Typography>
        <Typography style={styles.statLabel}>Day Streak</Typography>
      </View>
      
      <View style={styles.statCard}>
        <MaterialCommunityIcons
          name="chart-line"
          size={moderateScale(28)}
          color={theme.colors.info}
        />
        <Typography style={styles.statValue}>{averageScore}%</Typography>
        <Typography style={styles.statLabel}>Avg. Score</Typography>
      </View>
    </View>
  );
};
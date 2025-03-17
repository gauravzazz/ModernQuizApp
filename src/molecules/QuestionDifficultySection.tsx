import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing } from '../utils/scaling';
import { PieChart } from 'react-native-chart-kit';

interface QuestionDifficultyProps {
  easy: number;
  medium: number;
  hard: number;
  chartConfig: any;
  chartWidth: number;
}

export const QuestionDifficultySection: React.FC<QuestionDifficultyProps> = ({
  easy,
  medium,
  hard,
  chartConfig,
  chartWidth,
}) => {
  const theme = useTheme<AppTheme>();
  const total = easy + medium + hard;

  const styles = StyleSheet.create({
    container: {
      marginVertical: scaledSpacing(16),
    },
    chartContainer: {
      marginVertical: scaledSpacing(16),
      alignItems: 'center',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: scaledSpacing(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(6),
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    chartTitle: {
      marginBottom: scaledSpacing(16),
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: moderateScale(16),
    },
    chartSubtitle: {
      marginBottom: scaledSpacing(8),
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: moderateScale(12),
    },
    legendContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: scaledSpacing(8),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: scaledSpacing(8),
      marginVertical: scaledSpacing(4),
    },
    legendColor: {
      width: moderateScale(12),
      height: moderateScale(12),
      borderRadius: moderateScale(6),
      marginRight: scaledSpacing(4),
    },
    legendText: {
      fontSize: moderateScale(12),
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: scaledSpacing(24),
    },
  });

  if (total === 0) {
    return (
      <View style={styles.emptyState}>
        <Typography>No question data available for the selected time period.</Typography>
      </View>
    );
  }

  const pieData = [
    {
      name: 'Easy',
      population: easy,
      color: theme.colors.success,
      legendFontColor: theme.colors.onSurface,
    },
    {
      name: 'Medium',
      population: medium,
      color: theme.colors.warning,
      legendFontColor: theme.colors.onSurface,
    },
    {
      name: 'Hard',
      population: hard,
      color: theme.colors.error,
      legendFontColor: theme.colors.onSurface,
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Typography style={styles.chartTitle}>Question Difficulty Distribution</Typography>
        <Typography style={styles.chartSubtitle}>Based on your performance</Typography>
        
        <PieChart
          data={pieData}
          width={chartWidth - scaledSpacing(32)}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        
        <View style={styles.legendContainer}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Typography style={styles.legendText}>
                {item.name}: {item.population} ({Math.round((item.population / total) * 100)}%)
              </Typography>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
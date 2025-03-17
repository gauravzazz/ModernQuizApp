import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing } from '../utils/scaling';
import { LineChart } from 'react-native-chart-kit';

interface TimePerformanceProps {
  timeData: Array<{
    date: string;
    score: number;
  }>;
  chartConfig: any;
  chartWidth: number;
}

export const TimePerformanceSection: React.FC<TimePerformanceProps> = ({
  timeData,
  chartConfig,
  chartWidth,
}) => {
  const theme = useTheme<AppTheme>();

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
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: scaledSpacing(24),
    },
  });

  if (timeData.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Typography>No time data available for the selected time period.</Typography>
      </View>
    );
  }

  const lineChartData = {
    labels: timeData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: timeData.map(item => item.score),
        color: () => theme.colors.primary,
        strokeWidth: 2
      }
    ],
    legend: ['Score %']
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Typography style={styles.chartTitle}>Score Trend</Typography>
        <Typography style={styles.chartSubtitle}>Daily average score</Typography>
        
        <LineChart
          data={lineChartData}
          width={chartWidth - scaledSpacing(32)}
          height={220}
          chartConfig={{
            ...chartConfig,
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: theme.colors.neuLight,
              strokeWidth: 1
            },
            fillShadowGradientOpacity: 0.3
          }}
          bezier
          style={{
            borderRadius: 16,
            paddingRight: 16
          }}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={true}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
      </View>
    </View>
  );
};
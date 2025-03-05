import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuizResultChartsProps {
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  timePerQuestion: number[];
  screenWidth: number;
}

export const QuizResultCharts: React.FC<QuizResultChartsProps> = ({
  correctAnswers,
  incorrectAnswers,
  skippedAnswers,
  timePerQuestion,
  screenWidth,
}) => {
  const theme = useTheme<AppTheme>();

  // Prepare data for time chart
  const timeChartData = {
    labels: timePerQuestion.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        data: timePerQuestion,
        color: () => theme.colors.primary,
        strokeWidth: 2
      }
    ],
    legend: ['Time (seconds)']
  };

  // Prepare data for pie chart
  const pieChartData = [
    {
      name: 'Correct',
      population: correctAnswers,
      color: theme.colors.success,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12,
      icon: 'check-circle'
    },
    {
      name: 'Incorrect',
      population: incorrectAnswers,
      color: theme.colors.error,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12,
      icon: 'close-circle'
    },
    {
      name: 'Skipped',
      population: skippedAnswers,
      color: theme.colors.warning,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12,
      icon: 'skip-next-circle'
    }
  ];

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    chartContainer: {
      marginVertical: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    chartTitle: {
      marginBottom: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    timeChartContainer: {
      marginTop: 24,
    },
    accuracyContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 16,
    },
    pieChartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: screenWidth / 2,
    },
    legendContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    legendText: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendIcon: {
      marginRight: 4,
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    legendCount: {
      fontWeight: 'bold',
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      {/* Pie Chart for Answer Distribution */}
      <View style={styles.chartContainer}>
        <Typography variant="h6" style={styles.chartTitle}>
          Answer Distribution
        </Typography>
        <View style={styles.accuracyContainer}>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={screenWidth / 2}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
              hasLegend={false}
            />
          </View>
          <View style={styles.legendContainer}>
            {pieChartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <View style={styles.legendText}>
                  <MaterialCommunityIcons 
                    icon={item.icon} 
                    size={18} 
                    color={item.color} 
                    style={styles.legendIcon} 
                  />
                  <Typography variant="body2">
                    {item.name}:
                  </Typography>
                  <Typography variant="body2" style={styles.legendCount}>
                    {item.population}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Line Chart for Time per Question */}
      <View style={[styles.chartContainer, styles.timeChartContainer]}>
        <Typography variant="h6" style={styles.chartTitle}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
          {" Time per Question (seconds)"}
        </Typography>
        <LineChart
          data={timeChartData}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            ...chartConfig,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: theme.colors.primary
            },
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
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
        <View style={styles.chartLegend}>
          <MaterialCommunityIcons name="circle" size={12} color={theme.colors.primary} />
          <Typography variant="caption" style={{marginLeft: 4}}>
            Time (seconds)
          </Typography>
        </View>
      </View>
    </View>
  );
};
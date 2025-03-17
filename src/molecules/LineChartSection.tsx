import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { moderateScale, scaledFontSize, scaledSpacing } from '../utils/scaling';

interface LineChartSectionProps {
  title: string;
  subtitle: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity?: number) => string;
      strokeWidth?: number;
    }[];
    legend: string[];
  };
  chartConfig: any;
}

export const LineChartSection: React.FC<LineChartSectionProps> = ({
  title,
  subtitle,
  data,
  chartConfig,
}) => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth } = Dimensions.get('window');
  const chartWidth = screenWidth - scaledSpacing(32);

  const styles = StyleSheet.create({
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
      fontSize: scaledFontSize(16),
    },
    chartSubtitle: {
      marginBottom: scaledSpacing(8),
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: scaledFontSize(12),
    },
  });

  return (
    <View style={styles.chartContainer}>
      <Typography style={styles.chartTitle}>{title}</Typography>
      <Typography style={styles.chartSubtitle}>{subtitle}</Typography>
      
      <LineChart
        data={data}
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
  );
};
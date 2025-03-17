import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { moderateScale, scaledFontSize, scaledSpacing } from '../utils/scaling';

interface ChartItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
}

interface PieChartSectionProps {
  title: string;
  subtitle: string;
  data: ChartItem[];
  chartConfig: any;
}

export const PieChartSection: React.FC<PieChartSectionProps> = ({
  title,
  subtitle,
  data,
  chartConfig,
}) => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth } = Dimensions.get('window');
  const chartWidth = screenWidth - scaledSpacing(32);
  const total = data.reduce((sum, item) => sum + item.population, 0);

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
      fontSize: scaledFontSize(12),
    },
  });

  return (
    <View style={styles.chartContainer}>
      <Typography style={styles.chartTitle}>{title}</Typography>
      <Typography style={styles.chartSubtitle}>{subtitle}</Typography>
      
      <PieChart
        data={data}
        width={chartWidth - scaledSpacing(32)}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Typography style={styles.legendText}>
              {item.name}: {item.population} ({Math.round((item.population / total) * 100)}%)
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
};
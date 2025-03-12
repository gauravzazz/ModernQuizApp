import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Dimensions, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { moderateScale, scaledFontSize, scaledSpacing } from '../utils/scaling';

// Define a type for the MaterialCommunityIcons names we're using
type MaterialCommunityIconName = 'check-circle' | 'close-circle' | 'skip-next-circle' | 'clock-outline' | 'chevron-up' | 'chevron-down' | 'circle';

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
  screenWidth: propScreenWidth,
}) => {
  const theme = useTheme<AppTheme>();
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();
  
  // Use the provided screenWidth prop or calculate from dimensions if not provided
  const [screenWidth, setScreenWidth] = useState(propScreenWidth || windowWidth - 32);
  
  // Update screenWidth when window size changes
  useEffect(() => {
    const updateLayout = () => {
      const newWidth = propScreenWidth || Dimensions.get('window').width - 32;
      setScreenWidth(newWidth);
    };
    
    // Set initial width
    updateLayout();
    
    // Add event listener for dimension changes
    const dimensionsSubscription = Dimensions.addEventListener('change', updateLayout);
    
    return () => {
      // Clean up subscription
      dimensionsSubscription.remove();
    };
  }, [propScreenWidth]);

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate responsive sizes based on screen width
  const chartHeight = screenWidth < 360 ? 200 : 240; // Increased height for better visibility
  const pieChartSize = screenWidth < 360 ? screenWidth * 0.5 : screenWidth * 0.55; // Increased pie chart size
  const dotRadius = screenWidth < 360 ? 4 : 6;
  const strokeWidth = screenWidth < 360 ? 1.5 : 2;
  const fontSize = screenWidth < 360 ? 10 : 12;
  
  // Prepare data for time chart with responsive settings
  const timeChartData = {
    labels: timePerQuestion.length > 8 && screenWidth < 400 
      ? timePerQuestion.map((_, index) => index % 2 === 0 ? `Q${index + 1}` : '') // Show every other label on small screens
      : timePerQuestion.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        data: timePerQuestion,
        color: () => theme.colors.primary,
        strokeWidth
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
      legendFontSize: fontSize,
      icon: 'check-circle' as MaterialCommunityIconName
    },
    {
      name: 'Incorrect',
      population: incorrectAnswers,
      color: theme.colors.error,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: fontSize,
      icon: 'close-circle' as MaterialCommunityIconName
    },
    {
      name: 'Skipped',
      population: skippedAnswers,
      color: theme.colors.warning,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: fontSize,
      icon: 'skip-next-circle' as MaterialCommunityIconName
    }
  ];

  // Chart configuration with responsive settings
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
      r: `${dotRadius}`,
      strokeWidth: `${strokeWidth}`,
      stroke: theme.colors.primary
    },
    // Make font size responsive
    propsForLabels: {
      fontSize: scaledFontSize(fontSize),
    }
  };

  const styles = StyleSheet.create({
    collapsedHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: scaledSpacing(16),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    headerContent: {
      flex: 1,
      marginRight: scaledSpacing(16),
    },
    headerTitle: {
      marginBottom: scaledSpacing(8),
      fontWeight: 'bold',
    },
    headerStats: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: scaledSpacing(16),
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIcon: {
      marginRight: scaledSpacing(4),
    },
    expandIcon: {
      padding: scaledSpacing(4),
    },
    container: {
      marginBottom: scaledSpacing(24),
    },
    chartContainer: {
      marginVertical: scaledSpacing(16),
      alignItems: 'center',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: scaledSpacing(20), // Increased padding
      paddingBottom: scaledSpacing(24), // Extra padding at bottom
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      width: screenWidth - scaledSpacing(32), // Set explicit width
    },
    chartTitle: {
      marginBottom: scaledSpacing(16),
      textAlign: 'center',
      fontWeight: 'bold',
    },
    timeChartContainer: {
      marginTop: scaledSpacing(24),
    },
    accuracyContainer: {
      flexDirection: screenWidth < 400 ? 'column' : 'row', // Changed breakpoint from 360 to 400
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: scaledSpacing(16),
      width: '100%', // Ensure full width
    },
    pieChartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: screenWidth < 400 ? screenWidth - scaledSpacing(80) : screenWidth / 2.5, // Adjusted width
      marginBottom: screenWidth < 400 ? scaledSpacing(16) : 0,
      paddingRight: screenWidth < 400 ? 0 : scaledSpacing(16), // Add padding when in row layout
    },
    legendContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: screenWidth < 400 ? 0 : scaledSpacing(16),
      width: screenWidth < 400 ? '100%' : 'auto', // Full width on small screens
      alignItems: screenWidth < 400 ? 'center' : 'flex-start', // Center on small screens
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaledSpacing(12),
    },
    legendColor: {
      width: moderateScale(16),
      height: moderateScale(16),
      borderRadius: moderateScale(8),
      marginRight: scaledSpacing(8),
    },
    legendText: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendIcon: {
      marginRight: scaledSpacing(4),
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: scaledSpacing(8),
    },
    legendCount: {
      fontWeight: 'bold',
      marginLeft: scaledSpacing(4),
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.collapsedHeader}>
        <View style={styles.headerContent}>
          <Typography variant="h6" style={styles.headerTitle}>
            Quiz Performance Analysis
          </Typography>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={"check-circle" as MaterialCommunityIconName}
                size={moderateScale(16)}
                color={theme.colors.success}
                style={styles.statIcon}
              />
              <Typography variant="caption">{correctAnswers} Correct</Typography>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={"clock-outline" as MaterialCommunityIconName}
                size={moderateScale(16)}
                color={theme.colors.primary}
                style={styles.statIcon}
              />
              <Typography variant="caption">
                {Math.round(timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length)}s Avg
              </Typography>
            </View>
          </View>
        </View>
        <MaterialCommunityIcons
          name={(isExpanded ? "chevron-up" : "chevron-down") as MaterialCommunityIconName}
          size={moderateScale(24)}
          color={theme.colors.onSurface}
          style={styles.expandIcon}
        />
      </TouchableOpacity>

      <Animated.View style={{
        maxHeight: animatedHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1000]
        }),
        overflow: 'hidden',
        opacity: animatedHeight
      }}>
      {/* Pie Chart for Answer Distribution */}
      <View style={styles.chartContainer}>
        <Typography variant="h6" style={styles.chartTitle}>
          Answer Distribution
        </Typography>
        <View style={styles.accuracyContainer}>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={pieChartSize}
              height={pieChartSize}
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
                    name={item.icon as MaterialCommunityIconName} 
                    size={moderateScale(18)} 
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
          <MaterialCommunityIcons name={"clock-outline" as MaterialCommunityIconName} size={moderateScale(20)} color={theme.colors.primary} />
          {" Time per Question (seconds)"}
        </Typography>
        <LineChart
          data={timeChartData}
          width={screenWidth - scaledSpacing(80)} // Adjusted width
          height={chartHeight}
          chartConfig={{
            ...chartConfig,
            propsForDots: {
              r: `${dotRadius}`,
              strokeWidth: `${strokeWidth}`,
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
            paddingRight: 24, // Increased padding
            marginLeft: -10 // Adjust left margin to prevent cutting
          }}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={screenWidth >= 400}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
          yAxisInterval={screenWidth < 360 ? 2 : 1} // Show fewer horizontal lines on small screens
        />
        <View style={styles.chartLegend}>
          <MaterialCommunityIcons name={"circle" as MaterialCommunityIconName} size={moderateScale(12)} color={theme.colors.primary} />
          <Typography variant="caption" style={{marginLeft: scaledSpacing(4)}}>
            Time (seconds)
          </Typography>
        </View>
      </View>
      </Animated.View>
    </View>
  );
};
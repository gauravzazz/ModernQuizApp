import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { LoadingIndicator } from '../atoms/LoadingIndicator';
import { NavigationButton } from '../atoms/NavigationButton';
import { TimeRangeSelector, TimeRange } from '../molecules/TimeRangeSelector';
import { CollapsibleSection } from '../molecules/CollapsibleSection';
import { PerformanceOverviewSection } from '../molecules/PerformanceOverviewSection';
import { SubjectPerformanceSection } from '../molecules/SubjectPerformanceSection';
import { TopicPerformanceSection } from '../molecules/TopicPerformanceSection';
import { TimePerformanceSection } from '../molecules/TimePerformanceSection';
import { QuestionDifficultySection } from '../molecules/QuestionDifficultySection';
import { moderateScale, scaledSpacing } from '../utils/scaling';
import { registerAnalyticsListener, unregisterAnalyticsListener } from '../services/analyticsService';
import { useProgressData } from '../hooks/useProgressData';

export const ProgressScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth } = Dimensions.get('window');
  const navigation = useNavigation();
  
  // Use the custom hook for progress data
  const {
    timeRange,
    quizHistory,
    subjects,
    topics,
    totalQuizzes,
    accuracy,
    streak,
    averageScore,
    timeData,
    difficultyData,
    loading,
    error,
    handleTimeRangeChange,
    refreshProgress
  } = useProgressData('week');
  
  // State for collapsible sections
  const [overviewExpanded, setOverviewExpanded] = useState(true);
  const [subjectsExpanded, setSubjectsExpanded] = useState(true);
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [timeExpanded, setTimeExpanded] = useState(false);
  const [difficultyExpanded, setDifficultyExpanded] = useState(false);
  
  // Animated values for collapsible sections
  const overviewHeight = useRef(new Animated.Value(1)).current;
  const subjectsHeight = useRef(new Animated.Value(1)).current;
  const topicsHeight = useRef(new Animated.Value(0)).current;
  const timeHeight = useRef(new Animated.Value(0)).current;
  const difficultyHeight = useRef(new Animated.Value(0)).current;
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 0,
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
  
  // Toggle functions for collapsible sections
  const toggleOverview = () => {
    setOverviewExpanded(!overviewExpanded);
    Animated.timing(overviewHeight, {
      toValue: overviewExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const toggleSubjects = () => {
    setSubjectsExpanded(!subjectsExpanded);
    Animated.timing(subjectsHeight, {
      toValue: subjectsExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const toggleTopics = () => {
    setTopicsExpanded(!topicsExpanded);
    Animated.timing(topicsHeight, {
      toValue: topicsExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const toggleTime = () => {
    setTimeExpanded(!timeExpanded);
    Animated.timing(timeHeight, {
      toValue: timeExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const toggleDifficulty = () => {
    setDifficultyExpanded(!difficultyExpanded);
    Animated.timing(difficultyHeight, {
      toValue: difficultyExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  // Register for analytics updates to refresh progress data when quiz data changes
  useEffect(() => {
    // Create a listener function that will refresh progress data
    const handleAnalyticsUpdate = () => {
      refreshProgress();
    };
    
    // Register the listener
    registerAnalyticsListener(handleAnalyticsUpdate);
    
    // Clean up listener when component unmounts
    return () => {
      unregisterAnalyticsListener(handleAnalyticsUpdate);
    };
  }, [refreshProgress]);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(16),
      paddingHorizontal: moderateScale(16),
      paddingVertical: moderateScale(16),
      marginBottom: moderateScale(16),
    },
    title: {
      flex: 1,
    },
    subtitle: {
      marginBottom: moderateScale(16),
      paddingHorizontal: moderateScale(16),
    },
    sectionContainer: {
      marginBottom: scaledSpacing(16),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaledSpacing(24),
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: scaledSpacing(24),
    },
    noResultsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(24),
      paddingVertical: moderateScale(48),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      margin: moderateScale(16),
    },
    noResultsEmoji: {
      fontSize: 48,
      marginBottom: moderateScale(16),
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    noResultsTitle: {
      marginBottom: moderateScale(8),
      textAlign: 'center',
    },
    noResultsText: {
      textAlign: 'center',
    },
  });
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator size="large" />
        <Typography style={{ marginTop: scaledSpacing(16) }}>
          Loading your progress data...
        </Typography>
      </View>
    );
  }
  
  if (quizHistory.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <NavigationButton 
            variant="left" 
            onPress={() => navigation.goBack()} 
          />
          <Typography variant="h4" weight="bold" style={styles.title}>Progress</Typography>
        </View>
        
        <View style={styles.noResultsContainer}>
          <Typography variant="h5" weight="bold" style={styles.noResultsEmoji}>
            📊
          </Typography>
          <Typography variant="h6" weight="bold" style={styles.noResultsTitle}>
            No Progress Data Yet
          </Typography>
          <Typography
            variant="body1"
            color="onSurfaceVariant"
            style={styles.noResultsText}
          >
            Complete some quizzes to see your learning progress and analytics here.
          </Typography>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <NavigationButton 
          variant="left" 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="h4" weight="bold" style={styles.title}>Progress</Typography>
      </View>
      
      {/* Time Range Selector */}
      <TimeRangeSelector 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange} 
      />
      
      {/* Performance Overview Section */}
      <View style={styles.sectionContainer}>
        <CollapsibleSection
          title="Performance Overview"
          isExpanded={overviewExpanded}
          onToggle={toggleOverview}
          iconName="chart-bar"
          animatedHeight={overviewHeight}
        >
          <PerformanceOverviewSection
            totalQuizzes={totalQuizzes}
            accuracy={accuracy}
            streak={streak}
            averageScore={averageScore}
          />
        </CollapsibleSection>
      </View>
      
      {/* Subjects Performance Section */}
      <View style={styles.sectionContainer}>
        <CollapsibleSection
          title="Subject Performance"
          isExpanded={subjectsExpanded}
          onToggle={toggleSubjects}
          iconName="book-open-variant"
          animatedHeight={subjectsHeight}
        >
          <SubjectPerformanceSection subjects={subjects} />
        </CollapsibleSection>
      </View>
      
      {/* Topics Performance Section */}
      <View style={styles.sectionContainer}>
        <CollapsibleSection
          title="Topic Performance"
          isExpanded={topicsExpanded}
          onToggle={toggleTopics}
          iconName="lightbulb-on"
          animatedHeight={topicsHeight}
        >
          <TopicPerformanceSection topics={topics} />
        </CollapsibleSection>
      </View>
      
      {/* Time Performance Section */}
      <View style={styles.sectionContainer}>
        <CollapsibleSection
          title="Score Trends"
          isExpanded={timeExpanded}
          onToggle={toggleTime}
          iconName="chart-line"
          animatedHeight={timeHeight}
        >
          <TimePerformanceSection
            timeData={timeData}
            chartConfig={chartConfig}
            chartWidth={screenWidth}
          />
        </CollapsibleSection>
      </View>
      
      {/* Question Difficulty Section */}
      <View style={styles.sectionContainer}>
        <CollapsibleSection
          title="Question Difficulty"
          isExpanded={difficultyExpanded}
          onToggle={toggleDifficulty}
          iconName="chart-pie"
          animatedHeight={difficultyHeight}
        >
          <QuestionDifficultySection
            easy={difficultyData.easy}
            medium={difficultyData.medium}
            hard={difficultyData.hard}
            chartConfig={chartConfig}
            chartWidth={screenWidth}
          />
        </CollapsibleSection>
      </View>
    </ScrollView>
  );
}
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
import {
  getQuizHistory,
  getAllSubjectAnalytics,
  getAllTopicAnalytics,
  getQuizAnalytics,
  SubjectAnalytics,
  TopicAnalytics,
  ProcessedQuizResult
} from '../services/quizResultService';

export const ProgressScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth } = Dimensions.get('window');
  const navigation = useNavigation();
  
  // State for time range filtering
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  // State for analytics data
  const [quizHistory, setQuizHistory] = useState<ProcessedQuizResult[]>([]);
  const [subjects, setSubjects] = useState<SubjectAnalytics[]>([]);
  const [topics, setTopics] = useState<TopicAnalytics[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [timeData, setTimeData] = useState<Array<{ date: string; score: number }>>([]);
  const [difficultyData, setDifficultyData] = useState({ easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  
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
  
  // Handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };
  
  // Filter data based on selected time range
  const filterDataByTimeRange = (data: any[], dateField: string = 'lastAttempted') => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    if (timeRange === 'week') {
      return data.filter(item => new Date(item[dateField]) >= weekAgo);
    } else if (timeRange === 'month') {
      return data.filter(item => new Date(item[dateField]) >= monthAgo);
    }
    
    return data;
  };
  
  // Load analytics data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch quiz history
        const history = await getQuizHistory();
        const filteredHistory = filterDataByTimeRange(history, 'timestamp');
        setQuizHistory(filteredHistory);
        
        // Fetch subject analytics
        const allSubjects = await getAllSubjectAnalytics();
        const filteredSubjects = filterDataByTimeRange(allSubjects);
        setSubjects(filteredSubjects);
        
        // Fetch topic analytics
        const allTopics = await getAllTopicAnalytics();
        const filteredTopics = filterDataByTimeRange(allTopics);
        setTopics(filteredTopics);
        
        // Fetch overall quiz analytics
        const analytics = await getQuizAnalytics();
        setTotalQuizzes(filteredHistory.length);
        
        // Calculate accuracy
        if (filteredHistory.length > 0) {
          const totalCorrect = filteredHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
          const totalQuestions = filteredHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
          const calculatedAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
          setAccuracy(calculatedAccuracy);
          
          // Calculate average score
          const totalScore = filteredHistory.reduce((sum, quiz) => sum + quiz.scorePercentage, 0);
          const calculatedAvgScore = Math.round(totalScore / filteredHistory.length);
          setAverageScore(calculatedAvgScore);
        }
        
        // Mock streak data (in a real app, this would come from user profile)
        setStreak(5);
        
        // Prepare time performance data
        const timePerformanceData = prepareTimePerformanceData(filteredHistory);
        setTimeData(timePerformanceData);
        
        // Prepare difficulty distribution data
        const difficultyDistribution = prepareDifficultyData(filteredHistory);
        setDifficultyData(difficultyDistribution);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timeRange]);
  
  // Prepare time performance data
  const prepareTimePerformanceData = (history: ProcessedQuizResult[]) => {
    // Group quizzes by date and calculate average score for each date
    const dateMap = new Map<string, { totalScore: number; count: number }>();
    
    history.forEach(quiz => {
      const date = new Date(quiz.timestamp).toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { totalScore: 0, count: 0 });
      }
      const dateData = dateMap.get(date)!;
      dateData.totalScore += quiz.scorePercentage;
      dateData.count += 1;
    });
    
    // Convert map to array and sort by date
    const result = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      score: Math.round(data.totalScore / data.count)
    }));
    
    return result.sort((a, b) => a.date.localeCompare(b.date));
  };
  
  // Prepare difficulty distribution data
  const prepareDifficultyData = (history: ProcessedQuizResult[]) => {
    // Count questions by difficulty based on score
    let easy = 0;
    let medium = 0;
    let hard = 0;
    
    history.forEach(quiz => {
      if (quiz.scorePercentage >= 80) {
        easy += 1;
      } else if (quiz.scorePercentage >= 50) {
        medium += 1;
      } else {
        hard += 1;
      }
    });
    
    return { easy, medium, hard };
  };
  
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
          <Typography style={styles.title}>Your Progress</Typography>
          <Typography style={styles.subtitle}>
            Track your learning journey and performance over time
          </Typography>
        </View>
        
        <View style={styles.emptyState}>
          <Typography>No quiz data available yet. Complete some quizzes to see your progress!</Typography>
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
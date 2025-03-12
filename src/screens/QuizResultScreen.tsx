import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { Button } from '../atoms/Button';
import { RootStackParamList } from '../navigation';
import { saveQuizResults } from '../utils/quizResultsStorage';
import { QuizResultHeader } from '../molecules/QuizResultHeader';
import { QuizScoreCard } from '../molecules/QuizScoreCard';
import { QuizResultCharts } from '../molecules/QuizResultCharts';
import { QuizResultFilters } from '../molecules/QuizResultFilters';
import { QuizQuestionCard } from '../molecules/QuizQuestionCard';
import { Typography } from '../atoms/Typography';
import { addBookmark, removeBookmark, isQuestionBookmarked } from '../services/bookmarkService';
import { updateUserStats } from '../services/profileService';
import { UserAward } from '../types/profile';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { moderateScale, scaledFontSize, scaledSpacing, scaledRadius } from '../utils/scaling';
import { AchievementModal } from '../molecules/AchievementModal';
import { Confetti } from '../atoms/ConfettiCannon';

type QuizResultScreenRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;
type QuizResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'correct' | 'incorrect' | 'skipped';

export const QuizResultScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const navigation = useNavigation<QuizResultScreenNavigationProp>();
  const { attempts, totalTime, mode, subjectId, topicId, questionsData } = route.params;
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredQuestions, setFilteredQuestions] = useState(questionsData || []);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;
  const filterSectionY = useRef(0);
  const headerHeight = useRef(0);
  const [unlockedAwards, setUnlockedAwards] = useState<UserAward[]>([]);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    scrollY.addListener(({ value }) => {
      setShowStickyFilters(value > filterSectionY.current);
    });

    // Load bookmarked questions
    const loadBookmarkedStatus = async () => {
      if (!questionsData) return;
      const bookmarkedSet = new Set<string>();
      
      for (const question of questionsData) {
        const isBookmarked = await isQuestionBookmarked(question.id);
        if (isBookmarked) {
          bookmarkedSet.add(question.id);
        }
      }
      
      setBookmarkedQuestions(bookmarkedSet);
    };

    loadBookmarkedStatus();

    return () => {
      scrollY.removeAllListeners();
    };
  }, [questionsData]);

  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    headerHeight.current = height;
  };

  const onFilterSectionLayout = (event: any) => {
    const { y, height } = event.nativeEvent.layout;
    // Account for the header height when setting the filter section position
    filterSectionY.current = y;
  };
  const screenWidth = Dimensions.get('window').width - 32; // Full width minus padding
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    resultCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 24,
      marginBottom: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
      flexWrap: 'wrap',
    },
    statItem: {
      alignItems: 'center',
      minWidth: 80,
      margin: 8,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 16,
      marginBottom: 24,
    },
    chartContainer: {
      marginVertical: 16,
      alignItems: 'center',
    },
    chartTitle: {
      marginBottom: 8,
      textAlign: 'center',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 4,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 4,
      alignItems: 'center',
      borderRadius: theme.roundness - 4,
    },
    activeFilterButton: {
      backgroundColor: theme.colors.primary,
    },
    questionCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    questionText: {
      marginBottom: 12,
    },
    optionsContainer: {
      marginTop: 8,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 8,
      borderRadius: theme.roundness,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    optionSelected: {
      backgroundColor: theme.colors.error + '20', // Light red with opacity
      borderColor: theme.colors.error,
    },
    optionCorrect: {
      backgroundColor: theme.colors.success + '20', // Light green with opacity
      borderColor: theme.colors.success,
    },
    optionIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      backgroundColor: theme.colors.neuLight,
    },
    optionIndicatorSelected: {
      backgroundColor: theme.colors.error,
    },
    optionIndicatorCorrect: {
      backgroundColor: theme.colors.success,
    },
    optionText: {
      flex: 1,
    },
    sectionTitle: {
      marginTop: 24,
      marginBottom: 16,
    },
    noQuestionsText: {
      textAlign: 'center',
      padding: 16,
    },
    timeChartContainer: {
      marginTop: 16,
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
      marginBottom: 8,
    },
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    skippedBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: theme.colors.warning,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.roundness,
    },
    scoreText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    scoreLabel: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 16,
    },
    backButton: {
      marginTop: 24,
      marginBottom: 40,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingTop: 16,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
    },
    stickyFiltersContainer: {

    },
  });

  const correctAnswers = attempts.filter(
    (attempt) => !attempt.isSkipped && attempt.selectedOptionId === attempt.correctOptionId
  ).length;

  const incorrectAnswers = attempts.filter(
    (attempt) => !attempt.isSkipped && attempt.selectedOptionId !== attempt.correctOptionId && attempt.selectedOptionId !== null
  ).length;

  const skippedAnswers = attempts.filter(
    (attempt) => attempt.isSkipped || attempt.selectedOptionId === null
  ).length;

  const score = Math.round((correctAnswers / attempts.length) * 100);
  const accuracy = correctAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0;
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);
  
  // Create a map of time spent per question
  const timePerQuestion = attempts.reduce((acc, attempt) => {
    acc[attempt.questionId] = attempt.timeSpent;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate average time per question in seconds
  const avgTimePerQuestion = Object.values(timePerQuestion).reduce((sum, time) => sum + time, 0) / attempts.length / 1000;
  
  // Prepare data for time chart
  const timeChartData = {
    labels: attempts.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        data: attempts.map(attempt => attempt.timeSpent / 1000), // Convert to seconds
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
      legendFontSize: 12
    },
    {
      name: 'Incorrect',
      population: incorrectAnswers,
      color: theme.colors.error,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12
    },
    {
      name: 'Skipped',
      population: skippedAnswers,
      color: theme.colors.warning,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 12
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

  // Filter questions based on the active filter
  useEffect(() => {
    if (!questionsData) return;
    
    let filtered;
    switch (activeFilter) {
      case 'correct':
        filtered = questionsData.filter(q => {
          const attempt = attempts.find(a => a.questionId === q.id);
          return attempt && !attempt.isSkipped && attempt.selectedOptionId === attempt.correctOptionId;
        });
        break;
      case 'incorrect':
        filtered = questionsData.filter(q => {
          const attempt = attempts.find(a => a.questionId === q.id);
          return attempt && !attempt.isSkipped && attempt.selectedOptionId !== attempt.correctOptionId && attempt.selectedOptionId !== null;
        });
        break;
      case 'skipped':
        filtered = questionsData.filter(q => {
          const attempt = attempts.find(a => a.questionId === q.id);
          return attempt && (attempt.isSkipped || attempt.selectedOptionId === null);
        });
        break;
      default: // 'all'
        filtered = questionsData;
    }
    
    // Animate the transition
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    setFilteredQuestions(filtered);
    
    // Removed scroll to top behavior to maintain scroll position when filtering
  }, [activeFilter, questionsData, attempts]);
  
  // Save quiz results to AsyncStorage and update user stats
  useEffect(() => {
    const saveResults = async () => {
      // Save quiz results to storage
      await saveQuizResults({
        subjectId,
        topicId,
        mode,
        correctAnswers,
        totalQuestions: attempts.length,
        timePerQuestion
      });
      
      // Update user stats and trigger badge earning
      const timeSpentInMinutes = totalTime / 60000; // Convert ms to minutes
      const updatedProfile = await updateUserStats(
        correctAnswers,
        attempts.length,
        timeSpentInMinutes,
        mode as 'Practice' | 'Test'
      );
      
      // Check if any new awards were unlocked
      if (updatedProfile.newlyUnlockedAwards && updatedProfile.newlyUnlockedAwards.length > 0) {
        setUnlockedAwards(updatedProfile.newlyUnlockedAwards);
        setShowAwardModal(true);
      }
    };
    
    saveResults();
  }, [subjectId, topicId, mode, correctAnswers, attempts.length, timePerQuestion, totalTime]);



  // Fade in the screen when it loads and show confetti for good scores
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Show confetti for scores above 70% with a slight delay to ensure proper initialization
    if (score >= 70) {
      // Add a small delay before showing confetti to ensure the component is fully rendered
      const showTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 300);
      
      // Hide confetti after animation completes
      const hideTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [score]);

  // Import the AchievementModal component at the top of the file
  // import { AchievementModal } from '../molecules/AchievementModal';
  

  return (
    <View style={styles.container}>
      {showConfetti && (
        <Confetti 
          count={100}
          duration={5000}
          fadeOut={true}
        />
      )}
      <AchievementModal
        visible={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        awards={unlockedAwards}
      />
      
      <View onLayout={onHeaderLayout}>
        <QuizResultHeader title={`${mode} Results`} />
      </View>
      
      {showStickyFilters && (
        <View style={styles.stickyFiltersContainer}>
          <QuizResultFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            isSticky={true}
          />
        </View>
      )}
      
      <ScrollView
        ref={scrollViewRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <QuizScoreCard
          score={score}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          skippedAnswers={skippedAnswers}
          totalQuestions={attempts.length}
          accuracy={accuracy}
          totalTime={totalTime}
          avgTimePerQuestion={avgTimePerQuestion}
        />
        
        <QuizResultCharts
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          skippedAnswers={skippedAnswers}
          timePerQuestion={attempts.map(attempt => attempt.timeSpent / 1000)}
          screenWidth={screenWidth}
        />
        
        <View onLayout={onFilterSectionLayout}>
          <QuizResultFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </View>
        
        <Animated.View style={{ opacity: fadeAnim }}>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question, index) => {
              const attempt = attempts.find(a => a.questionId === question.id);
              if (!attempt) return null;
              
              return (
                <QuizQuestionCard
                  key={question.id}
                  question={question}
                  attempt={attempt}
                  index={index}
                  isBookmarked={bookmarkedQuestions.has(question.id)}
                  onBookmark={async (questionId) => {
                    const isCurrentlyBookmarked = bookmarkedQuestions.has(questionId);
                    try {
                      if (isCurrentlyBookmarked) {
                        await removeBookmark(questionId);
                        setBookmarkedQuestions(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(questionId);
                          return newSet;
                        });
                      } else {
                        await addBookmark(questionId);
                        setBookmarkedQuestions(prev => new Set(prev).add(questionId));
                      }
                    } catch (error) {
                      console.error('Error toggling bookmark:', error);
                    }
                  }}
                />
              );
            })
          ) : (
            <View style={styles.noQuestionsText}>
              <Typography variant="body1" color="onSurfaceVariant">
                No questions match the selected filter.
              </Typography>
            </View>
          )}
        </Animated.View>
        
        <Button
          label="Back to Home"
          onPress={() => navigation.navigate('Home')}
          variant="primary"
          style={styles.backButton}
        />
      </ScrollView>
    </View>
  );
};
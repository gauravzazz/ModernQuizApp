import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { Button } from '../atoms/Button';
import { RootStackParamList } from '../navigation';
import { QuizResultHeader } from '../molecules/QuizResultHeader';
import { QuizScoreCard } from '../molecules/QuizScoreCard';
import { QuizResultCharts } from '../molecules/QuizResultCharts';
import { QuizResultFilters } from '../molecules/QuizResultFilters';
import { QuizQuestionCard } from '../molecules/QuizQuestionCard';
import { Typography } from '../atoms/Typography';
import { addBookmark, removeBookmark, isQuestionBookmarked } from '../services/bookmarkService';
import { UserAward } from '../types/profile';
import { scaledFontSize, scaledSpacing, } from '../utils/scaling';
import { AchievementModal } from '../molecules/AchievementModal';
import { QuizCompletionModal } from '../molecules/QuizCompletionModal';
import { Confetti } from '../atoms/ConfettiCannon';
import { createPieChartData } from '../constants/quizConstants';
import { processAndSaveQuizResult, ProcessedQuizResult } from '../services/quizResultService';
import { processQuizAnalytics } from '../services/analyticsService';


type QuizResultScreenRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;
type QuizResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FilterType = 'all' | 'correct' | 'incorrect' | 'skipped';

export const QuizResultScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const navigation = useNavigation<QuizResultScreenNavigationProp>();
  const { attempts, totalTime, mode = 'Practice', subjectId = '', topicId = '', questionsData, topicTitle, subjectTitle, fromHistory, questionIds } = route.params;
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
  const [isProcessing, setIsProcessing] = useState(!fromHistory);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Processing quiz results...');
  const [processedResult, setProcessedResult] = useState<ProcessedQuizResult | null>(null);

  // State for quiz completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [xpData, setXpData] = useState<{
    oldXP: number;
    newXP: number;
    xpGained: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
  }>({ oldXP: 0, newXP: 0, xpGained: 0, oldLevel: 1, newLevel: 1, leveledUp: false });
  
  // Process and save quiz results when the screen loads (only if not from history)
  // Or fetch questions by IDs when viewing from history
  useEffect(() => {
    const processQuizData = async () => {
      try {
        setIsProcessing(true);
        setLoadingMessage('Processing quiz results...');
        
        if (!fromHistory) {
          // Step 1: Process analytics data using the central analytics service
          setLoadingMessage('Calculating quiz analytics...');
          const difficulty = 'medium'; // Default difficulty, could be passed from quiz params
          
          const analyticsResult = await processQuizAnalytics(
            attempts,
            totalTime,
            mode,
            subjectId,
            topicId,
            topicTitle || '',
            subjectTitle || '',
            questionsData || [],
            difficulty
          );
          
          // Step 2: Store the processed results and analytics data
          setProcessedResult(analyticsResult.processedResult);
          setXpData(analyticsResult.xpData);
          setUnlockedAwards(analyticsResult.unlockedAwards);
          
          // Step 3: Show completion modal if there are awards or level up
          if (analyticsResult.unlockedAwards.length > 0 || analyticsResult.xpData.leveledUp) {
            setShowCompletionModal(true);
          }
        }
        
        setFilteredQuestions(questionsData || []);
        setActiveFilter('all'); // Reset filter when screen mounts
        setIsProcessing(false);
        
        // Scroll to top when mounting
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
      } catch (err) {
        console.error('Error processing quiz results:', err);
        setError('Failed to process quiz results. Please try again.');
        setIsProcessing(false);
      }
    };
    
    processQuizData();
  }, [fromHistory, attempts, totalTime, mode, subjectId, topicId, topicTitle, subjectTitle, questionsData, questionIds]);
  
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      setShowStickyFilters(value > filterSectionY.current);
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, []);
  
  // Load bookmarked questions whenever filteredQuestions changes
  // Using a ref to track if the component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Set up the ref on mount and clear on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Load bookmarked status with memoized filteredQuestions IDs to prevent unnecessary reruns
  useEffect(() => {
    // Create a stable reference of question IDs to check
    const questionIds = filteredQuestions.map(q => q.id);
    const questionIdsKey = questionIds.join(',');
    
    const loadBookmarkedStatus = async () => {
      if (!filteredQuestions || filteredQuestions.length === 0) return;
      
      const bookmarkedSet = new Set<string>();
      
      for (const question of filteredQuestions) {
        try {
          const isBookmarked = await isQuestionBookmarked(question.id);
          if (isBookmarked) {
            bookmarkedSet.add(question.id);
          }
        } catch (error) {
          console.error(`Error checking bookmark status for question ${question.id}:`, error);
        }
      }
      
      // Only update state if the component is still mounted
      if (isMounted.current) {
        setBookmarkedQuestions(bookmarkedSet);
      }
    };

    loadBookmarkedStatus();
  }, [filteredQuestions.length, filteredQuestions[0]?.id]); // Only depend on length and first ID as a proxy for changes

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
      fontSize: scaledFontSize(40),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(4),
    },
    scoreLabel: {
      fontSize: scaledFontSize(10),
      color: theme.colors.onSurfaceVariant,
      marginBottom: scaledSpacing(10),
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
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
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

  // Handle edge case where there are no attempts
  const hasAttempts = Array.isArray(attempts) && attempts.length > 0;
  
  // Calculate score with validation to prevent NaN
  const score = hasAttempts ? Math.round((correctAnswers / attempts.length) * 100) : 0;
  
  // Calculate accuracy with validation to prevent NaN
  const totalAnswered = correctAnswers + incorrectAnswers;
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  
  // Calculate time values
  const minutes = Math.floor((totalTime || 0) / 60000);
  const seconds = Math.floor(((totalTime || 0) % 60000) / 1000);
  
  // Create a map of time spent per question with validation
  const timePerQuestion = hasAttempts ? attempts.reduce((acc, attempt) => {
    acc[attempt.questionId] = attempt.timeSpent || 0; // Ensure timeSpent is a number
    return acc;
  }, {} as Record<string, number>) : {};
  
  // Calculate average time per question in seconds with validation to prevent NaN
  const avgTimePerQuestion = hasAttempts ? 
    Object.values(timePerQuestion).reduce((sum, time) => sum + (time || 0), 0) / attempts.length / 1000 : 
    0;
  
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
  const pieChartData = createPieChartData(theme, correctAnswers, incorrectAnswers, skippedAnswers);

  // Filter questions based on the active filter
  useEffect(() => {
    if (!questionsData) return;

    const filteredData = questionsData.filter(question => {
      const attempt = attempts.find(a => a.questionId === question.id);
      if (!attempt) return false;

      switch (activeFilter) {
        case 'correct':
          return !attempt.isSkipped && attempt.selectedOptionId === attempt.correctOptionId;
        case 'incorrect':
          return !attempt.isSkipped && attempt.selectedOptionId !== attempt.correctOptionId && attempt.selectedOptionId !== null;
        case 'skipped':
          return attempt.isSkipped || attempt.selectedOptionId === null;
        default:
          return true;
      }
    });

    setFilteredQuestions(filteredData);
  }, [activeFilter, questionsData, attempts]);

  // Load bookmarked status for filtered questions
  useEffect(() => {
    const loadBookmarkedStatus = async () => {
      if (!filteredQuestions || filteredQuestions.length === 0) return;
      
      const bookmarkedSet = new Set<string>();
      
      for (const question of filteredQuestions) {
        try {
          const isBookmarked = await isQuestionBookmarked(question.id);
          if (isBookmarked) {
            bookmarkedSet.add(question.id);
          }
        } catch (error) {
          console.error(`Error checking bookmark status for question ${question.id}:`, error);
        }
      }
      
      // Only update state if the component is still mounted
      if (isMounted.current) {
        setBookmarkedQuestions(bookmarkedSet);
      }
    };

    loadBookmarkedStatus();
  }, [filteredQuestions])


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

  

  // Handle closing the completion modal
  const handleCompletionModalClose = () => {
    console.log('[QuizResultScreen] Closing completion modal, awards:', unlockedAwards.length);
    setShowCompletionModal(false);
    // Show award modal after completion modal closes if there are unlocked awards
    if (unlockedAwards.length > 0) {
      setShowAwardModal(true);
    }
  };
  
  // Add a debug log when the modal should be shown
  useEffect(() => {
    if (showCompletionModal) {
      console.log('[QuizResultScreen] Showing completion modal with XP data:', xpData);
    }
  }, [showCompletionModal]);

  if (isProcessing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Typography variant="body1" style={{ marginTop: 16 }}>
          {loadingMessage}
        </Typography>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Typography variant="body1" color="error" style={{ marginBottom: 16 }}>
          {error}
        </Typography>
        <Button
          label="Go Back"
          onPress={() => navigation.goBack()}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showConfetti && (
        <Confetti 
          count={100}
          duration={5000}
          fadeOut={true}
        />
      )}
      
      {/* Quiz Completion Modal - shows XP, level up, and awards summary */}
      <QuizCompletionModal
        visible={showCompletionModal}
        onClose={handleCompletionModalClose}
        xpData={xpData}
        score={{
          points: correctAnswers,
          total: attempts.length,
          percentage: score
        }}
      />

      
      {/* Achievement Modal - shows detailed award information */}
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
          timePerQuestion={attempts.map(attempt => (attempt.timeSpent || 0) / 1000)}
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
          label="Check Your Progress"
          onPress={() => navigation.navigate('Progress')}
          variant="primary"
          style={styles.backButton}
        />
      </ScrollView>
    </View>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { LoadingIndicator } from '../atoms/LoadingIndicator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { fetchQuestions } from '../services/questionService';
import { QuizNavigation } from '../molecules/QuizNavigation';
import { QuizHeader } from '../molecules/QuizHeader';
import { OptionsGrid } from '../molecules/OptionsGrid';
import { QuestionCard } from '../molecules/QuestionCard';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize, verticalScale } from '../utils/scaling';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
  difficulty?: number;
  tags?: string[];
  exam?: string;
}

interface QuestionAttempt {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  timeSpent: number;
  isSkipped: boolean;
}

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QUESTION_REVEAL_DELAY = 1000; // 1.5 seconds delay for showing correct answer in practice mode
const AUTO_NEXT_DELAY = 1500; // 2.5 seconds delay before moving to next question in practice mode

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  questionCard: {
    backgroundColor: theme.colors.neuPrimary,
    borderRadius: scaledRadius(theme.roundness * 2.5),
    padding: scaledSpacing(16),
    marginHorizontal: scaledSpacing(16),
    marginBottom: scaledSpacing(24),
    shadowColor: theme.colors.neuDark,
    shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
    shadowOpacity: theme.dark ? 0.6 : 0.3,
    shadowRadius: moderateScale(10),
    elevation: moderateScale(8),
    borderWidth: moderateScale(1.5),
    borderColor: theme.colors.neuLight,
    marginTop: scaledSpacing(16),
  },
  optionsContainer: {
    marginTop: scaledSpacing(24),
    gap: scaledSpacing(16),
  },
  optionButton: {
    backgroundColor: theme.colors.neuPrimary,
    borderRadius: scaledRadius(theme.roundness * 2),
    padding: scaledSpacing(20),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.neuDark,
    shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(8),
    elevation: moderateScale(6),
    borderWidth: moderateScale(1.5),
    borderColor: theme.colors.neuLight,
    marginBottom: scaledSpacing(16)
  },
  optionIndicator: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaledSpacing(20),
    shadowColor: theme.colors.neuDark,
    shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(4),
    borderWidth: moderateScale(1.5),
    borderColor: theme.colors.neuLight,
  },
  optionText: {
    flex: 1,
    fontSize: scaledFontSize(16),
    lineHeight: scaledFontSize(24),
  },
  correctOption: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
    transform: [{ scale: 1.02 }],
  },
  incorrectOption: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
    transform: [{ scale: 0.98 }],
  },
});
export const QuizScreen: React.FC = () => {
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const { questionCount, mode, topicId, subjectId, topicTitle, subjectTitle } = route.params;
  const theme = useTheme<AppTheme>();
  const styles = createStyles(theme);

  // Import mockQuestions at the top of the component to ensure it's available
  const { mockQuestions } = require('../services/questionService');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(3600); // 1 hour default

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const questions = await fetchQuestions(topicId, questionCount || 1);
        if (questions && questions.length > 0) {
          setQuizQuestions(questions);
          setQuizStartTime(Date.now());
          setQuestionStartTime(Date.now());
        } else {
          // Fallback to mock questions if no questions are returned
          setQuizQuestions(mockQuestions);
          setQuizStartTime(Date.now());
          setQuestionStartTime(Date.now());
        }
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        // Fallback to mock questions on error
        setQuizQuestions(mockQuestions);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [topicId, questionCount]);


  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          handleQuizSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = useCallback((optionId: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const timeSpent = Date.now() - questionStartTime;
  
    if (mode === 'Practice') {
      setSelectedOptionId(optionId);
      setShowCorrectAnswer(true);
  
      // Update attempts immediately
      setQuestionAttempts(prev => [
        ...prev,
        {
          questionId: currentQuestion.id,
          selectedOptionId: optionId,
          correctOptionId: currentQuestion.correctOptionId,
          timeSpent,
          isSkipped: false
        }
      ]);
  
      setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOptionId(null);
          setShowCorrectAnswer(false);
          setQuestionStartTime(Date.now());
        } else {
          // Force update attempts before submission
          setQuestionAttempts(prev => [...prev]);
          handleQuizSubmit();
        }
      }, AUTO_NEXT_DELAY);
    } else {
      // Test mode - allow deselection and reselection
      const newOptionId = selectedOptionId === optionId ? null : optionId;
      setSelectedOptionId(newOptionId);

      // Update question attempts with correctOptionId
      const existingAttemptIndex = questionAttempts.findIndex(a => a.questionId === currentQuestion.id);
      const newAttempt = {
        questionId: currentQuestion.id,
        selectedOptionId: newOptionId,
        correctOptionId: currentQuestion.correctOptionId,
        timeSpent,
        isSkipped: false
      };

      setQuestionAttempts(prev => {
        if (existingAttemptIndex >= 0) {
          return prev.map((attempt, index) => 
            index === existingAttemptIndex ? newAttempt : attempt
          );
        }
        return [...prev, newAttempt];
      });
    }
  }, [currentQuestionIndex, mode, questionStartTime, quizQuestions, selectedOptionId, questionAttempts]);

  const handleSkipQuestion = useCallback(() => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const timeSpent = Date.now() - questionStartTime;

    setQuestionAttempts(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOptionId: null,
        correctOptionId: currentQuestion.correctOptionId,
        timeSpent,
        isSkipped: true
      }
    ]);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setShowCorrectAnswer(false);
      setQuestionStartTime(Date.now());
    } else {
      handleQuizSubmit();
    }
  }, [currentQuestionIndex, questionStartTime, quizQuestions.length]);

  const handleQuizSubmit = useCallback(() => {
    const totalTime = Date.now() - quizStartTime;
    
    // Add logging to debug time calculation
    console.log('[TIME_DEBUG] Quiz start time:', quizStartTime);
    console.log('[TIME_DEBUG] Current time:', Date.now());
    console.log('[TIME_DEBUG] Total quiz time (ms):', totalTime);
    console.log('[TIME_DEBUG] Total quiz time (min):', totalTime / 60000);
    
    // Use functional update to get latest state
    setQuestionAttempts(prevAttempts => {
      const attemptsWithCorrectOptions = prevAttempts.map(attempt => {
        const question = quizQuestions.find(q => q.id === attempt.questionId);
        return {
          ...attempt,
          correctOptionId: question?.correctOptionId || '',
        };
      });
      
      const navigationParams = {
        attempts: attemptsWithCorrectOptions,
        totalTime,
        mode,
        subjectId,
        topicId,
        topicTitle,
        subjectTitle,
        questionsData: quizQuestions,
      };
      
      console.log('[DEBUG] Navigation params:', navigationParams);
      
      navigation.replace('QuizResult', navigationParams);
      return prevAttempts; // Preserve state for potential re-renders
    });
  }, [navigation, quizStartTime, mode, quizQuestions, subjectId, topicId, topicTitle, subjectTitle]);


  const handleNavigationButtonPress = useCallback((direction: 'prev' | 'next') => {
    if (mode === 'Test') {
      const newIndex = direction === 'next' ? 
        currentQuestionIndex + 1 : 
        currentQuestionIndex - 1;

      if (newIndex >= 0 && newIndex < quizQuestions.length) {
        setCurrentQuestionIndex(newIndex);
        // Find existing attempt for the question we're navigating to
        const nextQuestion = quizQuestions[newIndex];
        const existingAttempt = questionAttempts.find(a => a.questionId === nextQuestion.id);
        setSelectedOptionId(existingAttempt?.selectedOptionId || null);
        setQuestionStartTime(Date.now());
      }
    }
  }, [currentQuestionIndex, mode, quizQuestions.length, quizQuestions, questionAttempts]);

  if (isLoading) return <LoadingIndicator message="Loading questions..." />;
  if (error) return (
    <View style={[styles.container, styles.centerContent]}>
      <Typography variant="body1" color="error" style={{ marginBottom: scaledSpacing(16) }}>
        {error}
      </Typography>
      <Button
        label="Try Again"
        onPress={() => navigation.goBack()}
        variant="primary"
      />
    </View>
  );

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / quizQuestions.length;

  return (
    <View style={styles.container}>
      <View style={{ height: verticalScale(100) }}>
        <QuizHeader
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={quizQuestions.length}
          progress={progress}
          remainingTime={remainingTime}
          onClose={() => navigation.goBack()}
          onSubmit={handleQuizSubmit}
          mode={mode}
          questionAttempts={questionAttempts}
          onQuestionSelect={(index) => {
            setCurrentQuestionIndex(index);
            setSelectedOptionId(questionAttempts[index]?.selectedOptionId || null);
            setQuestionStartTime(Date.now());
          }}
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <QuestionCard
          text={currentQuestion?.text || 'Loading question...'}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizQuestions.length}
        />
        {currentQuestion ? (
          <OptionsGrid
            options={currentQuestion.options}
            selectedOptionId={selectedOptionId}
            correctOptionId={showCorrectAnswer ? currentQuestion.correctOptionId : undefined}
            showCorrectAnswer={showCorrectAnswer}
            onOptionPress={handleOptionSelect}
            disabled={showCorrectAnswer}
          />
        ) : (
          <View style={{padding: scaledSpacing(20), alignItems: 'center'}}>
            <Typography variant="body1">No more questions available.</Typography>
          </View>
        )}
      </ScrollView>
      <View>
        <QuizNavigation
          mode={mode}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={quizQuestions.length}
          onSkip={handleSkipQuestion}
          onPrevious={() => handleNavigationButtonPress('prev')}
          onNext={() => handleNavigationButtonPress('next')}
          onSubmit={handleQuizSubmit}
          hasSelectedOption={!!selectedOptionId}
        />
      </View>
    </View>
  );
};

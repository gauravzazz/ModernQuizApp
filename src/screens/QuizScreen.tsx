import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
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

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

interface QuestionAttempt {
  questionId: string;
  selectedOptionId: string | null;
  timeSpent: number;
  isSkipped: boolean;
}

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QUESTION_REVEAL_DELAY = 1500; // 1.5 seconds delay for showing correct answer in practice mode
const AUTO_NEXT_DELAY = 2500; // 2.5 seconds delay before moving to next question in practice mode

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  questionCard: {
    backgroundColor: theme.colors.neuPrimary,
    borderRadius: theme.roundness * 2,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: theme.colors.neuDark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.neuLight,
    marginTop: 16, // Added margin top for better spacing
  },
  optionsContainer: {
    marginTop: 24,
    gap: 16, // Increased gap between options
  },
  optionButton: {
    backgroundColor: theme.colors.neuPrimary,
    borderRadius: theme.roundness * 1.5, // Increased border radius
    padding: 20, // Increased padding
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.neuDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1.5, // Increased border width
    borderColor: theme.colors.neuLight,
    marginBottom: 16 // Increased margin bottom
  },
  optionIndicator: {
    width: 40, // Increased size
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20, // Increased margin
    shadowColor: theme.colors.neuDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.neuLight,
  },
  optionText: {
    flex: 1,
    fontSize: 16, // Added explicit font size
    lineHeight: 24, // Added line height for better readability
  },
  correctOption: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
    transform: [{ scale: 1.02 }], // Added subtle scale effect
  },
  incorrectOption: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
    transform: [{ scale: 0.98 }], // Added subtle scale effect
  },
});

export const QuizScreen: React.FC = () => {
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const { questionCount, mode, topicId, subjectId } = route.params;
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

    console.log('[DEBUG] handleOptionSelect called with:', {
      mode,
      optionId,
      currentQuestionId: currentQuestion.id,
      currentQuestionIndex,
      timeSpent
    });

    if (mode === 'Practice') {
      setSelectedOptionId(optionId);
      setShowCorrectAnswer(true);

      console.log('[DEBUG] Practice mode - before updating attempts:', {
        currentAttempts: questionAttempts,
        newAttempt: {
          questionId: currentQuestion.id,
          selectedOptionId: optionId,
          timeSpent,
          isSkipped: false
        }
      });

      // Update question attempt
      setQuestionAttempts(prev => {
        const newAttempts = [
          ...prev,
          {
            questionId: currentQuestion.id,
            selectedOptionId: optionId,
            timeSpent,
            isSkipped: false
          }
        ];
        console.log('[DEBUG] Practice mode - after updating attempts:', newAttempts);
        return newAttempts;
      });

      // Auto-advance to next question after delay
      setTimeout(() => {
        console.log('[DEBUG] Auto-advance timeout triggered', {
          currentIndex: currentQuestionIndex,
          totalQuestions: quizQuestions.length
        });
        
        if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOptionId(null);
          setShowCorrectAnswer(false);
          setQuestionStartTime(Date.now());
          console.log('[DEBUG] Advanced to next question');
        } else {
          console.log('[DEBUG] Last question reached, submitting quiz');
          handleQuizSubmit();
        }
      }, AUTO_NEXT_DELAY);
    } else {
      // Test mode - allow deselection and reselection
      const newOptionId = selectedOptionId === optionId ? null : optionId;
      setSelectedOptionId(newOptionId);

      // Update question attempts
      const existingAttemptIndex = questionAttempts.findIndex(a => a.questionId === currentQuestion.id);
      const newAttempt = {
        questionId: currentQuestion.id,
        selectedOptionId: newOptionId,
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

    console.log('[DEBUG] handleSkipQuestion called', {
      currentQuestionId: currentQuestion.id,
      currentQuestionIndex,
      timeSpent,
      mode
    });

    setQuestionAttempts(prev => {
      const newAttempts = [
        ...prev,
        {
          questionId: currentQuestion.id,
          selectedOptionId: null,
          timeSpent,
          isSkipped: true
        }
      ];
      console.log('[DEBUG] After skipping, attempts:', newAttempts);
      return newAttempts;
    });

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setShowCorrectAnswer(false);
      setQuestionStartTime(Date.now());
      console.log('[DEBUG] Advanced to next question after skip');
    } else if (mode === 'Practice') {
      // In Practice mode, submit the quiz when the last question is skipped
      console.log('[DEBUG] Last question skipped in Practice mode, submitting quiz');
      handleQuizSubmit();
    } else {
      // In Test mode, don't submit automatically when skipping the last question
      // Instead, keep the user on the last question to allow review
      console.log('[DEBUG] Last question skipped in Test mode, not submitting quiz');
      // Optionally show a message to the user that they can review their answers
    }
  }, [currentQuestionIndex, questionStartTime, quizQuestions]);

  const handleQuizSubmit = useCallback(() => {
    const totalTime = Date.now() - quizStartTime;
    
    console.log('[DEBUG] handleQuizSubmit called', {
      totalTime,
      currentQuestionIndex,
      totalQuestions: quizQuestions.length,
      currentAttempts: questionAttempts
    });
    
    // Get the current question's time spent if it's not yet recorded
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const currentTimeSpent = Date.now() - questionStartTime;
    
    // Update the current question's attempt if it exists, or add a new one
    const updatedAttempts = [...questionAttempts];
    const currentAttemptIndex = updatedAttempts.findIndex(a => a.questionId === currentQuestion.id);
    
    console.log('[DEBUG] Current question attempt check:', {
      currentQuestionId: currentQuestion.id,
      currentAttemptIndex,
      hasSelectedOption: !!selectedOptionId
    });
    
    if (currentAttemptIndex >= 0) {
      updatedAttempts[currentAttemptIndex] = {
        ...updatedAttempts[currentAttemptIndex],
        timeSpent: currentTimeSpent
      };
      console.log('[DEBUG] Updated existing attempt timeSpent');
    } else if (selectedOptionId) {
      updatedAttempts.push({
        questionId: currentQuestion.id,
        selectedOptionId: selectedOptionId,
        timeSpent: currentTimeSpent,
        isSkipped: false
      });
      console.log('[DEBUG] Added new attempt for current question');
    }
    
    // Ensure all questions have an attempt
    const finalAttempts = quizQuestions.map(question => {
      const existingAttempt = updatedAttempts.find(a => a.questionId === question.id);
      if (existingAttempt) return existingAttempt;
      
      // Create a skipped attempt for unanswered questions
      return {
        questionId: question.id,
        selectedOptionId: null,
        timeSpent: 0,
        isSkipped: true,
        correctOptionId: question.correctOptionId
      };
    });

    console.log('[DEBUG] Final attempts before navigation:', {
      attemptsCount: finalAttempts.length,
      attempts: finalAttempts
    });

    // Navigate to results screen
    // Explicitly log the IDs before navigation to verify they're being passed
    console.log('[QuizScreen] Submitting quiz with IDs:', { subjectId, topicId });
    
    const navigationParams = {
      attempts: finalAttempts.map(attempt => {
        const question = quizQuestions.find(q => q.id === attempt.questionId);
        return {
          ...attempt,
          correctOptionId: question?.correctOptionId || '',
          question: question?.text,
          options: question?.options
        };
      }),
      totalTime,
      mode,
      subjectId: subjectId, // Explicitly assign to ensure it's passed
      topicId: topicId,     // Explicitly assign to ensure it's passed
      questionsData: quizQuestions
    };
    
    console.log('[DEBUG] Navigation params:', navigationParams);
    
    navigation.replace('QuizResult', navigationParams);
  }, [navigation, questionAttempts, quizStartTime, mode, quizQuestions, currentQuestionIndex, questionStartTime, selectedOptionId, subjectId, topicId]);


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
      <Typography variant="body1" color="error" style={{ marginBottom: 16 }}>
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
      <View style={{ height: '15%' }}>
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

      <ScrollView style={{  }}>
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
          <View style={{padding: 20, alignItems: 'center'}}>
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
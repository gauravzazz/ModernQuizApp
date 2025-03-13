import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { QuizAttempt } from '../types/quizAttempt';

// Storage keys
const OVERALL_ACCURACY_KEY = '@quiz_overall_accuracy';
const SUBJECT_ACCURACY_KEY_PREFIX = '@quiz_subject_accuracy_';
const TOPIC_ACCURACY_KEY_PREFIX = '@quiz_topic_accuracy_';
const QUIZ_ATTEMPTS_KEY = '@quiz_attempts';
const MODE_SUFFIX = {
  Practice: '_practice',
  Test: '_test'
};

interface AccuracyData {
  correct: number;
  total: number;
  percentage: number;
}

interface QuizResultData {
  subjectId?: string;
  topicId?: string;
  mode: 'Practice' | 'Test';
  totalTime: number;
  attempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string;
    timeSpent: number;
    isSkipped: boolean;
  }>;
  topicTitle?: string;
  subjectTitle?: string;
  timestamp?: number;
  timePerQuestion?: Record<string, number>;
  correctAnswers?: number;
  totalQuestions?: number;
}

// Helper function to get or initialize accuracy data
const getAccuracyData = async (key: string): Promise<AccuracyData> => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error retrieving accuracy data for ${key}:`, error);
  }
  
  // Return default data if nothing exists
  return { correct: 0, total: 0, percentage: 0 };
};

// Helper function to update accuracy data
const updateAccuracyData = async (key: string, correct: number, total: number): Promise<void> => {
  try {
    // Get existing data
    const existingData = await getAccuracyData(key);
    
    // Update with new quiz results
    const updatedData: AccuracyData = {
      correct: existingData.correct + correct,
      total: existingData.total + total,
      percentage: 0 // Will calculate below
    };
    
    // Calculate new percentage
    updatedData.percentage = updatedData.total > 0 
      ? Math.round((updatedData.correct / updatedData.total) * 100) 
      : 0;
    
    // Save updated data
    await AsyncStorage.setItem(key, JSON.stringify(updatedData));
  } catch (error) {
    console.error(`Error updating accuracy data for ${key}:`, error);
  }
};

// Save quiz results and update accuracy metrics
export const saveQuizResults = async (quizData: QuizResultData): Promise<string> => {
  const { subjectId, topicId, mode, attempts, totalTime } = quizData;
  const modeSuffix = MODE_SUFFIX[mode];
  const quizId = uuidv4();
  
  // Calculate correctAnswers and totalQuestions from attempts if not provided
  const correctAnswers = quizData.correctAnswers || attempts.filter(a => a.selectedOptionId === a.correctOptionId).length;
  const totalQuestions = quizData.totalQuestions || attempts.length;
  
  // Calculate timePerQuestion if not provided
  const timePerQuestion = quizData.timePerQuestion || attempts.reduce((acc, attempt) => {
    acc[attempt.questionId] = attempt.timeSpent;
    return acc;
  }, {} as Record<string, number>);
  
  try {
    // Create quiz attempt record
    const quizAttempt: QuizAttempt = {
      id: quizId,
      subjectId: subjectId || '',
      topicId,
      mode,
      correctAnswers,
      totalQuestions,
      timePerQuestion,
      timestamp: Date.now(),
      processed: false
    };

    // Save quiz attempt
    const existingAttempts = await AsyncStorage.getItem(QUIZ_ATTEMPTS_KEY);
    const attempts: QuizAttempt[] = existingAttempts ? JSON.parse(existingAttempts) : [];
    attempts.push(quizAttempt);
    await AsyncStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(attempts));

    // Update accuracy metrics
    await updateAccuracyData(
      OVERALL_ACCURACY_KEY + modeSuffix, 
      correctAnswers, 
      totalQuestions
    );
    
    if (subjectId) {
      await updateAccuracyData(
        SUBJECT_ACCURACY_KEY_PREFIX + subjectId + modeSuffix,
        correctAnswers,
        totalQuestions
      );
    }
    
    if (topicId) {
      await updateAccuracyData(
        TOPIC_ACCURACY_KEY_PREFIX + topicId + modeSuffix,
        correctAnswers,
        totalQuestions
      );
    }
    
    console.log('Quiz results saved successfully');
    return quizId;
  } catch (error) {
    console.error('Error saving quiz results:', error);
    throw error;
  }
};

// Get unprocessed quiz attempts
export const getUnprocessedQuizAttempts = async (): Promise<QuizAttempt[]> => {
  try {
    const existingAttempts = await AsyncStorage.getItem(QUIZ_ATTEMPTS_KEY);
    const attempts: QuizAttempt[] = existingAttempts ? JSON.parse(existingAttempts) : [];
    return attempts.filter(attempt => !attempt.processed);
  } catch (error) {
    console.error('Error getting unprocessed quiz attempts:', error);
    return [];
  }
};

// Mark quiz attempt as processed
export const markQuizAttemptAsProcessed = async (quizId: string): Promise<void> => {
  try {
    const existingAttempts = await AsyncStorage.getItem(QUIZ_ATTEMPTS_KEY);
    if (!existingAttempts) return;

    const attempts: QuizAttempt[] = JSON.parse(existingAttempts);
    const updatedAttempts = attempts.map(attempt => 
      attempt.id === quizId ? { ...attempt, processed: true } : attempt
    );

    await AsyncStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(updatedAttempts));
  } catch (error) {
    console.error('Error marking quiz attempt as processed:', error);
  }
};

// Get overall accuracy
export const getOverallAccuracy = async (mode: 'Practice' | 'Test'): Promise<AccuracyData> => {
  return await getAccuracyData(OVERALL_ACCURACY_KEY + MODE_SUFFIX[mode]);
};

// Get subject accuracy
export const getSubjectAccuracy = async (subjectId: string, mode: 'Practice' | 'Test'): Promise<AccuracyData> => {
  return await getAccuracyData(SUBJECT_ACCURACY_KEY_PREFIX + subjectId + MODE_SUFFIX[mode]);
};

// Get topic accuracy
export const getTopicAccuracy = async (topicId: string, mode: 'Practice' | 'Test'): Promise<AccuracyData> => {
  return await getAccuracyData(TOPIC_ACCURACY_KEY_PREFIX + topicId + MODE_SUFFIX[mode]);
};

// Get time spent per question
export const calculateAverageTimePerQuestion = (timePerQuestion: Record<string, number>): number => {
  const times = Object.values(timePerQuestion);
  if (times.length === 0) return 0;
  
  const totalTime = times.reduce((sum, time) => sum + time, 0);
  return Math.round(totalTime / times.length);
};
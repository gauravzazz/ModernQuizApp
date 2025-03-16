import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizHistory } from '../types/quizAttempt';
import UUID from './uuid-polyfill';

const QUIZ_HISTORY_KEY = '@quiz_history';

export interface ProcessedQuizResult {
  id: string;
  quiz: string;
  subject: string;
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: string;
  date: number;
  timestamp: number;
  scorePercentage: number;
  subjectId: string;
  topicId?: string;
  duration: number;
  questionIds: string[];
  fromHistory: boolean;
  mode: 'Practice' | 'Test';
  attempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string;
    timeSpent: number;
    isSkipped: boolean;
  }>;
}

export const processAndSaveQuizResult = async (
  attempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string;
    timeSpent: number;
    isSkipped: boolean;
  }>,
  totalTime: number,
  mode: 'Practice' | 'Test',
  subjectId: string,
  topicId: string | undefined,
  topicTitle: string,
  subjectTitle: string,
  questionsData: Array<{
    id: string;
    text: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
  }>
): Promise<ProcessedQuizResult> => {
  const correctAnswers = attempts.filter(
    (attempt) => attempt.selectedOptionId === attempt.correctOptionId
  ).length;

  const scorePercentage = (correctAnswers / attempts.length) * 100;

  const processedResult: ProcessedQuizResult = {
    id: UUID.v4(),
    quiz: topicTitle,
    subject: subjectTitle,
    quizId: topicId || 'general',
    score: scorePercentage,
    correctAnswers,
    totalQuestions: attempts.length,
    timeTaken: formatTime(totalTime),
    date: Date.now(),
    timestamp: Date.now(),
    scorePercentage,
    subjectId,
    topicId,
    duration: totalTime,
    questionIds: questionsData.map(q => q.id),
    mode,
    fromHistory: false,
    attempts: attempts.map(({ questionId, selectedOptionId, correctOptionId, timeSpent, isSkipped }) => ({
      questionId,
      selectedOptionId,
      correctOptionId,
      timeSpent,
      isSkipped
    }))
  };

  await saveQuizHistory(processedResult);
  return processedResult;
};

const saveQuizHistory = async (result: ProcessedQuizResult): Promise<void> => {
  try {
    const existingHistoryString = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    const existingHistory: ProcessedQuizResult[] = existingHistoryString
      ? JSON.parse(existingHistoryString)
      : [];

    existingHistory.unshift(result);
    await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(existingHistory));
  } catch (error) {
    console.error('Error saving quiz history:', error);
    throw error;
  }
};

export const getQuizHistory = async (): Promise<ProcessedQuizResult[]> => {
  try {
    const historyString = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return [];
  }
};

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
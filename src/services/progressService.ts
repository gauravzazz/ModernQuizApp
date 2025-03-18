import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProcessedQuizResult, SubjectAnalytics, TopicAnalytics } from './quizResultService';

// Constants for AsyncStorage keys
const STREAK_KEY = '@user_streak';
const LAST_QUIZ_DATE_KEY = '@last_quiz_date';

// Interface for time-based performance data
interface TimePerformanceData {
  date: string;
  score: number;
}

// Interface for difficulty distribution data
interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

// Calculate and update user's streak
export const calculateAndUpdateStreak = async (quizDate: number): Promise<number> => {
  try {
    const lastQuizDateStr = await AsyncStorage.getItem(LAST_QUIZ_DATE_KEY);
    const currentStreakStr = await AsyncStorage.getItem(STREAK_KEY);
    
    const lastQuizDate = lastQuizDateStr ? new Date(parseInt(lastQuizDateStr)) : null;
    const currentStreak = currentStreakStr ? parseInt(currentStreakStr) : 0;
    const quizDateTime = new Date(quizDate);
    
    // Reset dates to start of day for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    quizDateTime.setHours(0, 0, 0, 0);
    
    if (!lastQuizDate) {
      // First quiz ever
      await AsyncStorage.setItem(STREAK_KEY, '1');
      await AsyncStorage.setItem(LAST_QUIZ_DATE_KEY, quizDate.toString());
      return 1;
    }
    
    lastQuizDate.setHours(0, 0, 0, 0);
    const dayDifference = Math.floor((quizDateTime.getTime() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreak = currentStreak;
    if (dayDifference === 1) {
      // Consecutive day
      newStreak += 1;
    } else if (dayDifference === 0) {
      // Same day, keep streak
      newStreak = currentStreak;
    } else {
      // Streak broken
      newStreak = 1;
    }
    
    await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());
    await AsyncStorage.setItem(LAST_QUIZ_DATE_KEY, quizDate.toString());
    
    return newStreak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};

// Calculate overall accuracy from quiz history
export const calculateAccuracy = (quizHistory: ProcessedQuizResult[]): number => {
  if (quizHistory.length === 0) return 0;
  
  const totalCorrect = quizHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
  const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
};

// Calculate average score from quiz history
export const calculateAverageScore = (quizHistory: ProcessedQuizResult[]): number => {
  if (quizHistory.length === 0) return 0;
  
  const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.scorePercentage, 0);
  return Math.round(totalScore / quizHistory.length);
};

// Prepare time performance data
export const prepareTimePerformanceData = (history: ProcessedQuizResult[]): TimePerformanceData[] => {
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
  
  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      score: Math.round(data.totalScore / data.count)
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Prepare difficulty distribution data
export const prepareDifficultyData = (history: ProcessedQuizResult[]): DifficultyDistribution => {
  const distribution = {
    easy: 0,
    medium: 0,
    hard: 0
  };
  
  history.forEach(quiz => {
    if (quiz.scorePercentage >= 80) {
      distribution.easy += 1;
    } else if (quiz.scorePercentage >= 50) {
      distribution.medium += 1;
    } else {
      distribution.hard += 1;
    }
  });
  
  return distribution;
};

// Filter data based on time range
export const filterDataByTimeRange = (
  data: any[],
  timeRange: 'week' | 'month' | 'all',
  dateField: string = 'lastAttempted'
): any[] => {
  if (timeRange === 'all') return data;
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const cutoffDate = timeRange === 'week' ? weekAgo : monthAgo;
  
  return data.filter(item => new Date(item[dateField]) >= cutoffDate);
};

// Get current streak
export const getCurrentStreak = async (): Promise<number> => {
  try {
    const streakStr = await AsyncStorage.getItem(STREAK_KEY);
    const lastQuizDateStr = await AsyncStorage.getItem(LAST_QUIZ_DATE_KEY);
    
    if (!streakStr || !lastQuizDateStr) return 0;
    
    const streak = parseInt(streakStr);
    const lastQuizDate = new Date(parseInt(lastQuizDateStr));
    const today = new Date();
    
    // Reset times to start of day
    lastQuizDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const dayDifference = Math.floor((today.getTime() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If more than 1 day has passed, streak is broken
    return dayDifference > 1 ? 0 : streak;
  } catch (error) {
    console.error('Error getting current streak:', error);
    return 0;
  }
};
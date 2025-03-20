import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizHistory } from '../types/quizAttempt';
import UUID from './uuid-polyfill';
import { updateUserStats } from './profileService';

const QUIZ_HISTORY_KEY = '@quiz_history';
const QUIZ_ANALYTICS_KEY = '@quiz_analytics';
const SUBJECT_ANALYTICS_KEY = '@subject_analytics';
const TOPIC_ANALYTICS_KEY = '@topic_analytics';
const QUESTION_ANALYTICS_KEY = '@question_analytics';

export interface QuizAnalytics {
  totalQuizzes: number;
  subjectAnalytics: Record<string, SubjectAnalytics>;
  topicAnalytics: Record<string, TopicAnalytics>;
  questionAnalytics: Record<string, QuestionAnalytics>;
  lastUpdated: number;
}

export interface SubjectAnalytics {
  id: string;
  title: string;
  totalQuizzes: number;
  correctAnswers: number;
  totalQuestions: number;
  averageScore: number;
  averageTimePerQuestion: number;
  practiceQuizzes: number;
  testQuizzes: number;
  lastAttempted: number;
}

export interface TopicAnalytics {
  id: string;
  title: string;
  subjectId: string;
  totalQuizzes: number;
  correctAnswers: number;
  totalQuestions: number;
  averageScore: number;
  averageTimePerQuestion: number;
  practiceQuizzes: number;
  testQuizzes: number;
  lastAttempted: number;
}

export interface QuestionAnalytics {
  id: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTimeSpent: number;
  skipCount: number;
  topicId?: string;
  subjectId: string;
  difficultyRating?: number; // Calculated based on success rate
  lastAttempted: number;
}

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
  
  // Save analytics data
  await saveQuizAnalytics(
    processedResult,
    attempts,
    subjectId,
    topicId,
    topicTitle,
    subjectTitle,
    totalTime
  );
  
  // Add logging to debug time calculation
  console.log('[TIME_DEBUG] Total time in ms before conversion:', totalTime);
  console.log('[TIME_DEBUG] Total time in minutes:', totalTime / 60000);
  
  // Update user profile stats - Convert ms to minutes properly
  // We divide by 60000 to convert milliseconds to minutes
  await updateUserStats(correctAnswers, attempts.length, totalTime / 60000, mode);
  
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

// Helper function to calculate new average
const calculateNewAverage = (
  currentAverage: number,
  newValue: number,
  totalItems: number
): number => {
  if (totalItems <= 1) return newValue;
  return Math.round(((currentAverage * (totalItems - 1)) + newValue) / totalItems);
};

/**
 * Saves detailed analytics data for quizzes at multiple levels:
 * - Overall quiz analytics
 * - Subject-specific analytics
 * - Topic-specific analytics
 * - Question-specific analytics
 */
export const saveQuizAnalytics = async (
  result: ProcessedQuizResult,
  attempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string;
    timeSpent: number;
    isSkipped: boolean;
  }>,
  subjectId: string,
  topicId: string | undefined,
  topicTitle: string,
  subjectTitle: string,
  totalTime: number
): Promise<void> => {
  try {
    // Get existing analytics or initialize new ones
    const analytics = await getQuizAnalytics();
    
    // Update overall quiz count
    analytics.totalQuizzes += 1;
    analytics.lastUpdated = Date.now();
    
    // Calculate quiz metrics
    const correctAnswers = attempts.filter(
      (attempt) => attempt.selectedOptionId === attempt.correctOptionId
    ).length;
    const averageTimePerQuestion = totalTime / attempts.length;
    
    // Update subject analytics
    await updateSubjectAnalytics(
      subjectId,
      subjectTitle,
      correctAnswers,
      attempts.length,
      averageTimePerQuestion,
      result.mode,
      result.scorePercentage
    );
    
    // Update topic analytics if topic exists
    if (topicId) {
      await updateTopicAnalytics(
        topicId,
        topicTitle,
        subjectId,
        correctAnswers,
        attempts.length,
        averageTimePerQuestion,
        result.mode,
        result.scorePercentage
      );
    }
    
    // Update question-specific analytics
    await updateQuestionAnalytics(attempts, subjectId, topicId);
    
    // Save updated analytics
    await AsyncStorage.setItem(QUIZ_ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving quiz analytics:', error);
  }
};

/**
 * Retrieves the overall quiz analytics
 */
export const getQuizAnalytics = async (): Promise<QuizAnalytics> => {
  try {
    const analyticsString = await AsyncStorage.getItem(QUIZ_ANALYTICS_KEY);
    if (analyticsString) {
      return JSON.parse(analyticsString);
    }
    
    // Return default analytics structure if none exists
    return {
      totalQuizzes: 0,
      subjectAnalytics: {},
      topicAnalytics: {},
      questionAnalytics: {},
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Error getting quiz analytics:', error);
    return {
      totalQuizzes: 0,
      subjectAnalytics: {},
      topicAnalytics: {},
      questionAnalytics: {},
      lastUpdated: Date.now()
    };
  }
};

/**
 * Updates analytics for a specific subject
 */
const updateSubjectAnalytics = async (
  subjectId: string,
  subjectTitle: string,
  correctAnswers: number,
  totalQuestions: number,
  averageTimePerQuestion: number,
  mode: 'Practice' | 'Test',
  scorePercentage: number
): Promise<void> => {
  try {
    const subjectAnalyticsString = await AsyncStorage.getItem(`${SUBJECT_ANALYTICS_KEY}_${subjectId}`);
    let subjectAnalytics: SubjectAnalytics;
    
    if (subjectAnalyticsString) {
      subjectAnalytics = JSON.parse(subjectAnalyticsString);
    } else {
      // Initialize new subject analytics
      subjectAnalytics = {
        id: subjectId,
        title: subjectTitle,
        totalQuizzes: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        averageScore: 0,
        averageTimePerQuestion: 0,
        practiceQuizzes: 0,
        testQuizzes: 0,
        lastAttempted: Date.now()
      };
    }
    
    // Update subject analytics
    subjectAnalytics.totalQuizzes += 1;
    subjectAnalytics.correctAnswers += correctAnswers;
    subjectAnalytics.totalQuestions += totalQuestions;
    subjectAnalytics.lastAttempted = Date.now();
    
    // Update mode-specific counts
    if (mode === 'Practice') {
      subjectAnalytics.practiceQuizzes += 1;
    } else {
      subjectAnalytics.testQuizzes += 1;
    }
    
    // Calculate new average score
    subjectAnalytics.averageScore = calculateNewAverage(
      subjectAnalytics.averageScore,
      scorePercentage,
      subjectAnalytics.totalQuizzes
    );
    
    // Calculate new average time per question
    subjectAnalytics.averageTimePerQuestion = calculateNewAverage(
      subjectAnalytics.averageTimePerQuestion,
      averageTimePerQuestion,
      subjectAnalytics.totalQuizzes
    );
    
    // Save updated subject analytics
    await AsyncStorage.setItem(
      `${SUBJECT_ANALYTICS_KEY}_${subjectId}`,
      JSON.stringify(subjectAnalytics)
    );
  } catch (error) {
    console.error(`Error updating subject analytics for ${subjectId}:`, error);
  }
};

/**
 * Updates analytics for a specific topic
 */
const updateTopicAnalytics = async (
  topicId: string,
  topicTitle: string,
  subjectId: string,
  correctAnswers: number,
  totalQuestions: number,
  averageTimePerQuestion: number,
  mode: 'Practice' | 'Test',
  scorePercentage: number
): Promise<void> => {
  try {
    const topicAnalyticsString = await AsyncStorage.getItem(`${TOPIC_ANALYTICS_KEY}_${topicId}`);
    let topicAnalytics: TopicAnalytics;
    
    if (topicAnalyticsString) {
      topicAnalytics = JSON.parse(topicAnalyticsString);
    } else {
      // Initialize new topic analytics
      topicAnalytics = {
        id: topicId,
        title: topicTitle,
        subjectId,
        totalQuizzes: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        averageScore: 0,
        averageTimePerQuestion: 0,
        practiceQuizzes: 0,
        testQuizzes: 0,
        lastAttempted: Date.now()
      };
    }
    
    // Update topic analytics
    topicAnalytics.totalQuizzes += 1;
    topicAnalytics.correctAnswers += correctAnswers;
    topicAnalytics.totalQuestions += totalQuestions;
    topicAnalytics.lastAttempted = Date.now();
    
    // Update mode-specific counts
    if (mode === 'Practice') {
      topicAnalytics.practiceQuizzes += 1;
    } else {
      topicAnalytics.testQuizzes += 1;
    }
    
    // Calculate new average score
    topicAnalytics.averageScore = calculateNewAverage(
      topicAnalytics.averageScore,
      scorePercentage,
      topicAnalytics.totalQuizzes
    );
    
    // Calculate new average time per question
    topicAnalytics.averageTimePerQuestion = calculateNewAverage(
      topicAnalytics.averageTimePerQuestion,
      averageTimePerQuestion,
      topicAnalytics.totalQuizzes
    );
    
    // Save updated topic analytics
    await AsyncStorage.setItem(
      `${TOPIC_ANALYTICS_KEY}_${topicId}`,
      JSON.stringify(topicAnalytics)
    );
  } catch (error) {
    console.error(`Error updating topic analytics for ${topicId}:`, error);
  }
};

/**
 * Updates analytics for individual questions
 */
const updateQuestionAnalytics = async (
  attempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string;
    timeSpent: number;
    isSkipped: boolean;
  }>,
  subjectId: string,
  topicId?: string
): Promise<void> => {
  try {
    // Process each question attempt
    for (const attempt of attempts) {
      const questionId = attempt.questionId;
      const questionAnalyticsString = await AsyncStorage.getItem(`${QUESTION_ANALYTICS_KEY}_${questionId}`);
      let questionAnalytics: QuestionAnalytics;
      
      if (questionAnalyticsString) {
        questionAnalytics = JSON.parse(questionAnalyticsString);
      } else {
        // Initialize new question analytics
        questionAnalytics = {
          id: questionId,
          totalAttempts: 0,
          correctAttempts: 0,
          averageTimeSpent: 0,
          skipCount: 0,
          topicId,
          subjectId,
          lastAttempted: Date.now()
        };
      }
      
      // Update question analytics
      questionAnalytics.totalAttempts += 1;
      questionAnalytics.lastAttempted = Date.now();
      
      // Check if the answer was correct
      if (attempt.selectedOptionId === attempt.correctOptionId) {
        questionAnalytics.correctAttempts += 1;
      }
      
      // Check if the question was skipped
      if (attempt.isSkipped) {
        questionAnalytics.skipCount += 1;
      }
      
      // Calculate new average time spent
      questionAnalytics.averageTimeSpent = calculateNewAverage(
        questionAnalytics.averageTimeSpent,
        attempt.timeSpent,
        questionAnalytics.totalAttempts
      );
      
      // Calculate difficulty rating based on success rate
      // Lower success rate = higher difficulty (1-5 scale)
      const successRate = questionAnalytics.correctAttempts / questionAnalytics.totalAttempts;
      questionAnalytics.difficultyRating = Math.round(5 - (successRate * 4)) || 3; // Default to medium if not enough data
      
      // Save updated question analytics
      await AsyncStorage.setItem(
        `${QUESTION_ANALYTICS_KEY}_${questionId}`,
        JSON.stringify(questionAnalytics)
      );
    }
  } catch (error) {
    console.error('Error updating question analytics:', error);
  }
};

/**
 * Retrieves analytics for a specific subject
 */
export const getSubjectAnalytics = async (subjectId: string): Promise<SubjectAnalytics | null> => {
  try {
    const analyticsString = await AsyncStorage.getItem(`${SUBJECT_ANALYTICS_KEY}_${subjectId}`);
    return analyticsString ? JSON.parse(analyticsString) : null;
  } catch (error) {
    console.error(`Error getting subject analytics for ${subjectId}:`, error);
    return null;
  }
};

/**
 * Retrieves analytics for all subjects
 */
export const getAllSubjectAnalytics = async (): Promise<SubjectAnalytics[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const subjectKeys = keys.filter(key => key.startsWith(SUBJECT_ANALYTICS_KEY));
    
    const results = await AsyncStorage.multiGet(subjectKeys);
    return results
      .map(([_, value]) => (value ? JSON.parse(value) : null))
      .filter((item): item is SubjectAnalytics => item !== null)
      .sort((a, b) => b.lastAttempted - a.lastAttempted); // Sort by most recent
  } catch (error) {
    console.error('Error getting all subject analytics:', error);
    return [];
  }
};

/**
 * Retrieves analytics for a specific topic
 */
export const getTopicAnalytics = async (topicId: string): Promise<TopicAnalytics | null> => {
  try {
    const analyticsString = await AsyncStorage.getItem(`${TOPIC_ANALYTICS_KEY}_${topicId}`);
    return analyticsString ? JSON.parse(analyticsString) : null;
  } catch (error) {
    console.error(`Error getting topic analytics for ${topicId}:`, error);
    return null;
  }
};

/**
 * Retrieves analytics for all topics in a subject
 */
export const getTopicAnalyticsBySubject = async (subjectId: string): Promise<TopicAnalytics[]> => {
  try {
    const allTopics = await getAllTopicAnalytics();
    return allTopics.filter(topic => topic.subjectId === subjectId);
  } catch (error) {
    console.error(`Error getting topic analytics for subject ${subjectId}:`, error);
    return [];
  }
};

/**
 * Retrieves analytics for all topics
 */
export const getAllTopicAnalytics = async (): Promise<TopicAnalytics[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const topicKeys = keys.filter(key => key.startsWith(TOPIC_ANALYTICS_KEY));
    
    const results = await AsyncStorage.multiGet(topicKeys);
    return results
      .map(([_, value]) => (value ? JSON.parse(value) : null))
      .filter((item): item is TopicAnalytics => item !== null)
      .sort((a, b) => b.lastAttempted - a.lastAttempted); // Sort by most recent
  } catch (error) {
    console.error('Error getting all topic analytics:', error);
    return [];
  }
};

/**
 * Retrieves analytics for a specific question
 */
export const getQuestionAnalytics = async (questionId: string): Promise<QuestionAnalytics | null> => {
  try {
    const analyticsString = await AsyncStorage.getItem(`${QUESTION_ANALYTICS_KEY}_${questionId}`);
    return analyticsString ? JSON.parse(analyticsString) : null;
  } catch (error) {
    console.error(`Error getting question analytics for ${questionId}:`, error);
    return null;
  }
};

/**
 * Retrieves analytics for all questions in a topic
 */
export const getQuestionAnalyticsByTopic = async (topicId: string): Promise<QuestionAnalytics[]> => {
  try {
    const allQuestions = await getAllQuestionAnalytics();
    return allQuestions.filter(question => question.topicId === topicId);
  } catch (error) {
    console.error(`Error getting question analytics for topic ${topicId}:`, error);
    return [];
  }
};

/**
 * Retrieves analytics for all questions in a subject
 */
export const getQuestionAnalyticsBySubject = async (subjectId: string): Promise<QuestionAnalytics[]> => {
  try {
    const allQuestions = await getAllQuestionAnalytics();
    return allQuestions.filter(question => question.subjectId === subjectId);
  } catch (error) {
    console.error(`Error getting question analytics for subject ${subjectId}:`, error);
    return [];
  }
};

/**
 * Retrieves analytics for all questions
 */
export const getAllQuestionAnalytics = async (): Promise<QuestionAnalytics[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const questionKeys = keys.filter(key => key.startsWith(QUESTION_ANALYTICS_KEY));
    
    const results = await AsyncStorage.multiGet(questionKeys);
    return results
      .map(([_, value]) => (value ? JSON.parse(value) : null))
      .filter((item): item is QuestionAnalytics => item !== null)
      .sort((a, b) => b.lastAttempted - a.lastAttempted); // Sort by most recent
  } catch (error) {
    console.error('Error getting all question analytics:', error);
    return [];
  }
};

/**
 * Gets the most difficult questions based on success rate
 */
export const getMostDifficultQuestions = async (limit: number = 10): Promise<QuestionAnalytics[]> => {
  try {
    const allQuestions = await getAllQuestionAnalytics();
    // Filter questions with enough attempts to be statistically significant
    const significantQuestions = allQuestions.filter(q => q.totalAttempts >= 3);
    // Sort by difficulty rating (highest first)
    return significantQuestions
      .sort((a, b) => (b.difficultyRating || 0) - (a.difficultyRating || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting most difficult questions:', error);
    return [];
  }
};

/**
 * Gets the most improved topics based on score trends
 */
export const getMostImprovedTopics = async (limit: number = 5): Promise<TopicAnalytics[]> => {
  try {
    const allTopics = await getAllTopicAnalytics();
    // Filter topics with enough quizzes to show improvement
    const significantTopics = allTopics.filter(t => t.totalQuizzes >= 3);
    // For a real implementation, you would need to store historical data
    // This is a simplified version that just returns topics with highest scores
    return significantTopics
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting most improved topics:', error);
    return [];
  }
};
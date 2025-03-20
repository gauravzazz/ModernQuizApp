import { getUserProfile, saveUserProfile } from './profileService';
import { calculateQuizXP, updateUserXP } from './xpService';
import { checkQuizAchievements } from './achievementService';
import { calculateAndUpdateStreak } from './progressService';
import { processAndSaveQuizResult } from './quizResultService';
import { UserAward, UserProfile } from '../types/profile';

// Event listeners for real-time updates
type AnalyticsEventListener = () => void;
const analyticsEventListeners: AnalyticsEventListener[] = [];

/**
 * Register a listener for analytics updates
 * @param listener Function to call when analytics are updated
 */
export const registerAnalyticsListener = (listener: AnalyticsEventListener): void => {
  analyticsEventListeners.push(listener);
};

/**
 * Unregister a listener for analytics updates
 * @param listener Function to remove from listeners
 */
export const unregisterAnalyticsListener = (listener: AnalyticsEventListener): void => {
  const index = analyticsEventListeners.indexOf(listener);
  if (index !== -1) {
    analyticsEventListeners.splice(index, 1);
  }
};

/**
 * Notify all listeners that analytics have been updated
 */
export const notifyAnalyticsUpdated = (): void => {
  analyticsEventListeners.forEach(listener => listener());
};

/**
 * Central service for processing quiz analytics
 * This service coordinates all analytics-related operations after quiz completion
 * to ensure consistent data across the app
 */

/**
 * Process all quiz analytics in one place
 * @param attempts - Array of question attempts with user answers and timing data
 * @param totalTime - Total time spent on the quiz in milliseconds
 * @param mode - Quiz mode (Practice or Test)
 * @param subjectId - Subject ID
 * @param topicId - Topic ID (optional)
 * @param topicTitle - Topic title
 * @param subjectTitle - Subject title
 * @param questionsData - Array of question data
 * @param difficulty - Quiz difficulty level
 * @returns Object containing processed results and unlocked awards
 */
export const processQuizAnalytics = async (
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
  }>,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<{
  processedResult: any;
  xpData: {
    oldXP: number;
    newXP: number;
    xpGained: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
  };
  unlockedAwards: UserAward[];
}> => {
  try {
    // Step 1: Process and save quiz result (stores in AsyncStorage)
    const processedResult = await processAndSaveQuizResult(
      attempts,
      totalTime,
      mode,
      subjectId,
      topicId,
      topicTitle,
      subjectTitle,
      questionsData
    );

    // Calculate basic metrics needed for other services
    const correctAnswers = attempts.filter(
      (attempt) => attempt.selectedOptionId === attempt.correctOptionId
    ).length;
    const totalQuestions = attempts.length;
    const timeSpentInSeconds = totalTime / 1000; // Convert milliseconds to seconds

    // Step 2: Update user XP and level - this is the ONLY place where XP should be calculated
    // to avoid duplicate calculations
    const xpData = await updateUserXP(
      correctAnswers,
      totalQuestions,
      timeSpentInSeconds,
      mode,
      difficulty
    );

    // Step 3: Check for unlocked achievements
    const unlockedAwards = await checkQuizAchievements(
      correctAnswers,
      totalQuestions,
      timeSpentInSeconds,
      mode,
      difficulty
    );

    // Step 4: Update streak (already handled in checkQuizAchievements)
    // This ensures streak is updated only once

    // Step 5: Synchronize awards to ensure consistency
    await synchronizeAnalytics();
    
    // Step 6: Notify listeners that analytics have been updated
    notifyAnalyticsUpdated();

    return {
      processedResult,
      xpData,
      unlockedAwards
    };
  } catch (error) {
    console.error('Error processing quiz analytics:', error);
    throw error;
  }
};

/**
 * Synchronize all analytics data to ensure consistency across services
 * This is useful when data might be out of sync or after app updates
 */
export const synchronizeAnalytics = async (): Promise<void> => {
  try {
    // Get current user profile
    const profile = await getUserProfile();
    
    // Ensure streak is up to date
    await calculateAndUpdateStreak(Date.now());
    
    // Recalculate level based on XP
    profile.level = Math.floor(profile.stats.xp / 100) + 1;
    
    // Calculate level progress percentage
    profile.levelProgress = ((profile.stats.xp % 100) / 100) * 100;
    
    // Save updated profile
    await saveUserProfile(profile);
    
    // Notify listeners that analytics have been updated
    notifyAnalyticsUpdated();
  } catch (error) {
    console.error('Error synchronizing analytics:', error);
  }
};
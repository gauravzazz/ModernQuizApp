import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, saveUserProfile } from './profileService';
import { UserProfile } from '../types/profile';

// Constants for XP calculation
const BASE_XP_PER_CORRECT_ANSWER = 10;
const DIFFICULTY_MULTIPLIERS = {
  easy: 0.8,
  medium: 1.0,
  hard: 1.5,
};
const STREAK_BONUS_THRESHOLD = 3; // Days
const STREAK_BONUS_MULTIPLIER = 0.1; // 10% bonus per day above threshold
const PERFECT_SCORE_BONUS = 20; // Bonus XP for 100% score
const SPEED_BONUS_THRESHOLD = 15; // Seconds per question
const SPEED_BONUS_XP = 5; // Bonus XP for fast answers
const TEST_MODE_MULTIPLIER = 1.2; // 20% more XP in test mode

/**
 * Calculate XP earned from a quiz attempt
 */
export const calculateQuizXP = (
  correctAnswers: number,
  totalQuestions: number,
  timeSpentInSeconds: number,
  mode: 'Practice' | 'Test',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  streak: number = 0
): number => {
  // Base XP calculation
  let xp = correctAnswers * BASE_XP_PER_CORRECT_ANSWER;
  
  // Apply difficulty multiplier
  xp *= DIFFICULTY_MULTIPLIERS[difficulty];
  
  // Apply mode multiplier
  if (mode === 'Test') {
    xp *= TEST_MODE_MULTIPLIER;
  }
  
  // Perfect score bonus
  if (correctAnswers === totalQuestions && totalQuestions > 0) {
    xp += PERFECT_SCORE_BONUS;
  }
  
  // Speed bonus (if average time per question is below threshold)
  const avgTimePerQuestion = totalQuestions > 0 ? timeSpentInSeconds / totalQuestions : 0;
  if (avgTimePerQuestion < SPEED_BONUS_THRESHOLD && correctAnswers > 0) {
    xp += SPEED_BONUS_XP;
  }
  
  // Streak bonus
  if (streak > STREAK_BONUS_THRESHOLD) {
    const streakBonus = 1 + ((streak - STREAK_BONUS_THRESHOLD) * STREAK_BONUS_MULTIPLIER);
    xp *= Math.min(streakBonus, 2); // Cap at 2x multiplier
  }
  
  return Math.round(xp);
};

/**
 * Update user's XP with animation data for the UI
 */
export const updateUserXP = async (
  correctAnswers: number,
  totalQuestions: number,
  timeSpentInSeconds: number,
  mode: 'Practice' | 'Test',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<{
  oldXP: number;
  newXP: number;
  xpGained: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
}> => {
  // Get current user profile
  const profile = await getUserProfile();
  const oldXP = profile.stats.xp;
  const oldLevel = profile.level;
  
  // Calculate XP gained
  const xpGained = calculateQuizXP(
    correctAnswers,
    totalQuestions,
    timeSpentInSeconds,
    mode,
    difficulty,
    profile.stats.streak
  );
  
  // Update profile XP
  profile.stats.xp += xpGained;
  
  // Calculate new level (simple calculation - every 100 XP is a level)
  const newLevel = Math.floor(profile.stats.xp / 100) + 1;
  profile.level = newLevel;
  
  // Calculate level progress percentage
  const levelProgress = ((profile.stats.xp % 100) / 100) * 100;
  profile.levelProgress = levelProgress;
  
  // Save updated profile
  await saveUserProfile(profile);
  
  // Return animation data
  return {
    oldXP,
    newXP: profile.stats.xp,
    xpGained,
    oldLevel,
    newLevel,
    leveledUp: newLevel > oldLevel
  };
};
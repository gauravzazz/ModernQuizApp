import { getUserProfile, saveUserProfile } from './profileService';
import { UserProfile, UserAward } from '../types/profile';
import { calculateAndUpdateStreak } from './progressService';

/**
 * Helper function to unlock an award
 * @param award - The award to unlock
 * @param newlyUnlockedAwards - Array to track newly unlocked awards
 * @returns boolean indicating if the award was unlocked
 */
const unlockAward = (award: UserAward | undefined, newlyUnlockedAwards: UserAward[]) => {
  if (award && !award.unlocked) {
    award.unlocked = true;
    award.unlockedAt = new Date();
    newlyUnlockedAwards.push(award);
    return true;
  }
  return false;
};

/**
 * Helper function to update progress on an award
 * @param award - The award to update progress for
 * @param currentProgress - The current progress value
 * @param newlyUnlockedAwards - Array to track newly unlocked awards
 * @returns boolean indicating if the progress was updated
 */
const updateProgress = (award: UserAward | undefined, currentProgress: number, newlyUnlockedAwards: UserAward[]) => {
  if (award && !award.unlocked && award.maxProgress !== undefined) {
    award.progress = currentProgress;
    if (currentProgress >= award.maxProgress) {
      unlockAward(award, newlyUnlockedAwards);
    }
    return true;
  }
  return false;
};

/**
 * Check for newly unlocked achievements based on quiz performance
 * @param correctAnswers - Number of correct answers in the quiz
 * @param totalQuestions - Total number of questions in the quiz
 * @param timeSpentInSeconds - Time spent on the quiz in seconds
 * @param mode - Quiz mode (Practice or Test)
 * @param difficulty - Quiz difficulty level
 * @returns Array of newly unlocked awards
 */
export const checkQuizAchievements = async (
  correctAnswers: number,
  totalQuestions: number,
  timeSpentInSeconds: number,
  mode: 'Practice' | 'Test',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<UserAward[]> => {
  const profile = await getUserProfile();
  const stats = profile.stats;
  const updatedAwards = [...profile.awards];
  const newlyUnlockedAwards: UserAward[] = [];
  
  // Calculate quiz accuracy
  const quizAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // Basic Awards
  // -------------
  
  // First Quiz Award
  const firstQuizAward = updatedAwards.find(award => award.id === 'first_quiz');
  if (stats.totalQuizzes === 1) {
    unlockAward(firstQuizAward, newlyUnlockedAwards);
  }
  
  // Perfect Score Award
  const perfectScoreAward = updatedAwards.find(award => award.id === 'perfect_score');
  if (quizAccuracy === 100 && totalQuestions >= 5) {
    unlockAward(perfectScoreAward, newlyUnlockedAwards);
  }
  
  // Perfect 10 Award (track progress for 10 perfect scores)
  const perfect10Award = updatedAwards.find(award => award.id === 'perfect_10');
  if (perfect10Award && quizAccuracy === 100 && totalQuestions >= 5) {
    const currentProgress = (perfect10Award.progress || 0) + 1;
    updateProgress(perfect10Award, currentProgress, newlyUnlockedAwards);
  }
  
  // Speed Awards
  // ------------
  
  // Speed Demon Award (complete quiz in under 2 minutes with at least 5 questions)
  const speedDemonAward = updatedAwards.find(award => award.id === 'speed_demon');
  if (timeSpentInSeconds < 120 && totalQuestions >= 5 && quizAccuracy >= 70) {
    unlockAward(speedDemonAward, newlyUnlockedAwards);
  }
  
  // Lightning Fast Award (track progress for 20 fast answers)
  const lightningFastAward = updatedAwards.find(award => award.id === 'lightning_fast');
  if (lightningFastAward && (timeSpentInSeconds / totalQuestions) < 30) { // Less than 30 seconds per question
    const currentProgress = (lightningFastAward.progress || 0) + correctAnswers;
    updateProgress(lightningFastAward, currentProgress, newlyUnlockedAwards);
  }
  
  // Marathon Runner Award (complete a quiz with 50+ questions)
  const marathonAward = updatedAwards.find(award => award.id === 'marathon_runner');
  if (totalQuestions >= 50) {
    unlockAward(marathonAward, newlyUnlockedAwards);
  }
  
  // Time-based Awards
  // ----------------
  
  const currentHour = new Date().getHours();
  
  // Night Owl Award (after 10 PM)
  const nightOwlAward = updatedAwards.find(award => award.id === 'night_owl');
  if (currentHour >= 22) {
    unlockAward(nightOwlAward, newlyUnlockedAwards);
  }
  
  // Early Bird Award (before 8 AM)
  const earlyBirdAward = updatedAwards.find(award => award.id === 'early_bird');
  if (currentHour < 8) {
    unlockAward(earlyBirdAward, newlyUnlockedAwards);
  }
  
  // Mode-specific Awards
  // -------------------
  
  // Test Champion Award (score over 90% in Test mode)
  const testChampionAward = updatedAwards.find(award => award.id === 'test_champion');
  if (mode === 'Test' && quizAccuracy > 90 && totalQuestions >= 10) {
    unlockAward(testChampionAward, newlyUnlockedAwards);
  }
  
  // Practice Makes Perfect Award (track progress for 20 practice quizzes)
  const practiceMakesPerfectAward = updatedAwards.find(award => award.id === 'practice_makes_perfect');
  if (practiceMakesPerfectAward && mode === 'Practice') {
    const currentProgress = (practiceMakesPerfectAward.progress || 0) + 1;
    updateProgress(practiceMakesPerfectAward, currentProgress, newlyUnlockedAwards);
  }
  
  // Test Ace Award (track progress for 5 perfect test mode quizzes)
  const testAceAward = updatedAwards.find(award => award.id === 'test_ace');
  if (testAceAward && mode === 'Test' && quizAccuracy === 100) {
    const currentProgress = (testAceAward.progress || 0) + 1;
    updateProgress(testAceAward, currentProgress, newlyUnlockedAwards);
  }
  
  // Difficulty Awards
  // ----------------
  
  if (difficulty === 'easy' && quizAccuracy === 100) {
    const easyPeasyAward = updatedAwards.find(award => award.id === 'easy_peasy');
    if (easyPeasyAward) {
      const currentProgress = (easyPeasyAward.progress || 0) + 1;
      updateProgress(easyPeasyAward, currentProgress, newlyUnlockedAwards);
    }
  } else if (difficulty === 'medium' && quizAccuracy >= 90) {
    const mediumRareAward = updatedAwards.find(award => award.id === 'medium_rare');
    if (mediumRareAward) {
      const currentProgress = (mediumRareAward.progress || 0) + 1;
      updateProgress(mediumRareAward, currentProgress, newlyUnlockedAwards);
    }
  } else if (difficulty === 'hard' && quizAccuracy >= 80) {
    const hardcoreHeroAward = updatedAwards.find(award => award.id === 'hardcore_hero');
    if (hardcoreHeroAward) {
      const currentProgress = (hardcoreHeroAward.progress || 0) + 1;
      updateProgress(hardcoreHeroAward, currentProgress, newlyUnlockedAwards);
    }
  }
  
  // XP Milestone Awards
  // ------------------
  
  const xpMilestoneAward = updatedAwards.find(award => award.id === 'xp_1000');
  if (xpMilestoneAward) {
    updateProgress(xpMilestoneAward, stats.xp, newlyUnlockedAwards);
  }
  
  // Update streak if needed
  await calculateAndUpdateStreak(Date.now());
  
  // Save the updated profile
  profile.awards = updatedAwards;
  await saveUserProfile(profile);
  
  return newlyUnlockedAwards;
};

/**
 * Synchronize awards between profileService and achievementService
 * This ensures that awards are consistent across both services
 * @returns Array of newly unlocked awards
 */
export const synchronizeAwards = async (): Promise<UserAward[]> => {
  const profile = await getUserProfile();
  const newlyUnlockedAwards: UserAward[] = [];
  
  // Check for streak-based awards
  const streakAwards = profile.awards.filter(award => 
    award.id.startsWith('streak_') && !award.unlocked && award.maxProgress !== undefined
  );
  
  for (const award of streakAwards) {
    if (profile.stats.streak >= (award.maxProgress || 0)) {
      award.unlocked = true;
      award.unlockedAt = new Date();
      newlyUnlockedAwards.push(award);
    } else {
      award.progress = profile.stats.streak;
    }
  }
  
  // Check for quiz quantity awards
  const quizQuantityAwards = profile.awards.filter(award => 
    award.id === 'quiz_master' && !award.unlocked && award.maxProgress !== undefined
  );
  
  for (const award of quizQuantityAwards) {
    if (profile.stats.totalQuizzes >= (award.maxProgress || 0)) {
      award.unlocked = true;
      award.unlockedAt = new Date();
      newlyUnlockedAwards.push(award);
    } else {
      award.progress = profile.stats.totalQuizzes;
    }
  }
  
  // Check for accuracy awards
  const accuracyAwards = profile.awards.filter(award => 
    award.id === 'accuracy_king' && !award.unlocked
  );
  
  for (const award of accuracyAwards) {
    if (profile.stats.overallAccuracy >= 90 && profile.stats.totalQuizzes >= 10) {
      award.unlocked = true;
      award.unlockedAt = new Date();
      newlyUnlockedAwards.push(award);
    }
  }
  
  // If any awards were unlocked, save the profile
  if (newlyUnlockedAwards.length > 0) {
    await saveUserProfile(profile);
  }
  
  return newlyUnlockedAwards;
};
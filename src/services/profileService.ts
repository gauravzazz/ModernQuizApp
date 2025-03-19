import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserAward, UserStats } from '../types/profile';

const PROFILE_STORAGE_KEY = '@user_profile';
const DEFAULT_AWARDS = [
  // Original Awards
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'streak_7',
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a quiz after 10 PM',
    icon: '🦉',
    unlocked: false,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a quiz before 8 AM',
    icon: '🐦',
    unlocked: false,
  },
  {
    id: 'accuracy_king',
    name: 'Accuracy King',
    description: 'Maintain 90% accuracy over 10 quizzes',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'test_champion',
    name: 'Test Champion',
    description: 'Score over 90% in Test mode',
    icon: '📝',
    unlocked: false,
  },
  
  // Quiz Performance Awards
  {
    id: 'perfect_10',
    name: 'Perfect 10',
    description: 'Get 10 perfect scores',
    icon: '🔟',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Complete 5 quizzes in a row with 100% accuracy',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Answer 20 questions in under 30 seconds each',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Complete a quiz with 50+ questions',
    icon: '🏃',
    unlocked: false,
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Score 90%+ after previously failing the same quiz',
    icon: '🔄',
    unlocked: false,
  },
  
  // Streak Awards
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '📅',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'streak_100',
    name: 'Century Club',
    description: 'Maintain a 100-day streak',
    icon: '💯',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete quizzes on 5 consecutive weekends',
    icon: '🏋️',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  
  // Subject Mastery Awards
  {
    id: 'science_whiz',
    name: 'Science Whiz',
    description: 'Score 90%+ on 10 science quizzes',
    icon: '🔬',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'math_genius',
    name: 'Math Genius',
    description: 'Score 90%+ on 10 math quizzes',
    icon: '🧮',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'history_buff',
    name: 'History Buff',
    description: 'Score 90%+ on 10 history quizzes',
    icon: '📜',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'language_lover',
    name: 'Language Lover',
    description: 'Score 90%+ on 10 language quizzes',
    icon: '🔤',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'arts_aficionado',
    name: 'Arts Aficionado',
    description: 'Score 90%+ on 10 arts quizzes',
    icon: '🎨',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  
  // Topic Completion Awards
  {
    id: 'topic_explorer',
    name: 'Topic Explorer',
    description: 'Complete quizzes in 5 different topics',
    icon: '🧭',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'topic_master',
    name: 'Topic Master',
    description: 'Score 90%+ in all quizzes of a single topic',
    icon: '🏅',
    unlocked: false,
  },
  {
    id: 'jack_of_all_trades',
    name: 'Jack of All Trades',
    description: 'Complete quizzes in 15 different topics',
    icon: '🃏',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
  },
  
  // Time-based Awards
  {
    id: 'lunch_learner',
    name: 'Lunch Learner',
    description: 'Complete a quiz between 12 PM and 1 PM',
    icon: '🍱',
    unlocked: false,
  },
  {
    id: 'weekend_scholar',
    name: 'Weekend Scholar',
    description: 'Complete 10 quizzes on weekends',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'holiday_hero',
    name: 'Holiday Hero',
    description: 'Complete a quiz on a major holiday',
    icon: '🎄',
    unlocked: false,
  },
  
  // Milestone Awards
  {
    id: 'century_mark',
    name: 'Century Mark',
    description: 'Complete 100 quizzes',
    icon: '🏛️',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'question_1000',
    name: 'Question 1000',
    description: 'Answer 1000 questions',
    icon: '❓',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
  },
  {
    id: 'xp_1000',
    name: 'XP Milestone: 1000',
    description: 'Earn 1000 XP',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
  },
  
  // Special Mode Awards
  {
    id: 'practice_makes_perfect',
    name: 'Practice Makes Perfect',
    description: 'Complete 20 quizzes in Practice mode',
    icon: '🔄',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'test_ace',
    name: 'Test Ace',
    description: 'Score 100% on 5 Test mode quizzes',
    icon: '📋',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'timed_master',
    name: 'Timed Master',
    description: 'Complete 10 timed quizzes with 90%+ accuracy',
    icon: '⏱️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  
  // Difficulty Awards
  {
    id: 'easy_peasy',
    name: 'Easy Peasy',
    description: 'Complete 10 easy difficulty quizzes with 100% accuracy',
    icon: '🟢',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'medium_rare',
    name: 'Medium Rare',
    description: 'Complete 10 medium difficulty quizzes with 90%+ accuracy',
    icon: '🟡',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'hardcore_hero',
    name: 'Hardcore Hero',
    description: 'Complete 5 hard difficulty quizzes with 80%+ accuracy',
    icon: '🔴',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'difficulty_climber',
    name: 'Difficulty Climber',
    description: 'Complete quizzes at all difficulty levels',
    icon: '🧗',
    unlocked: false,
  },
  
  // Social Awards
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Share 5 quiz results on social media',
    icon: '🦋',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'quiz_creator',
    name: 'Quiz Creator',
    description: 'Create your first custom quiz',
    icon: '✏️',
    unlocked: false,
  },
  {
    id: 'popular_creator',
    name: 'Popular Creator',
    description: 'Have 10 users take your custom quiz',
    icon: '👥',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  
  // Special Achievement Awards
  {
    id: 'comeback_streak',
    name: 'Comeback Streak',
    description: 'Resume your streak after missing a day',
    icon: '🔙',
    unlocked: false,
  },
  {
    id: 'photographic_memory',
    name: 'Photographic Memory',
    description: 'Answer 20 questions correctly in under 10 seconds each',
    icon: '📸',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 100% on 3 consecutive quizzes',
    icon: '💎',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  
  // Seasonal Awards
  {
    id: 'spring_scholar',
    name: 'Spring Scholar',
    description: 'Complete 10 quizzes during spring',
    icon: '🌸',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'summer_student',
    name: 'Summer Student',
    description: 'Complete 10 quizzes during summer',
    icon: '☀️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'autumn_academic',
    name: 'Autumn Academic',
    description: 'Complete 10 quizzes during autumn',
    icon: '🍂',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'winter_wizard',
    name: 'Winter Wizard',
    description: 'Complete 10 quizzes during winter',
    icon: '❄️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  
  // Device-specific Awards
  {
    id: 'mobile_master',
    name: 'Mobile Master',
    description: 'Complete 20 quizzes on a mobile device',
    icon: '📱',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'desktop_dominator',
    name: 'Desktop Dominator',
    description: 'Complete 20 quizzes on a desktop device',
    icon: '🖥️',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'device_diversity',
    name: 'Device Diversity',
    description: 'Complete quizzes on 3 different device types',
    icon: '📲',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  
  // Time Management Awards
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete 5 quizzes in a single day',
    icon: '🏎️',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'time_optimizer',
    name: 'Time Optimizer',
    description: 'Improve your completion time on the same quiz by 30%',
    icon: '⏲️',
    unlocked: false,
  },
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Complete quizzes at the same time for 5 consecutive days',
    icon: '🕰️',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  
  // Special Content Awards
  {
    id: 'science_explorer',
    name: 'Science Explorer',
    description: 'Complete quizzes in 5 different science topics',
    icon: '🧪',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'history_traveler',
    name: 'History Traveler',
    description: 'Complete quizzes spanning 5 different historical periods',
    icon: '🏺',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'geography_globetrotter',
    name: 'Geography Globetrotter',
    description: 'Complete quizzes about 7 different continents',
    icon: '🌍',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'literature_lover',
    name: 'Literature Lover',
    description: 'Complete 10 literature quizzes',
    icon: '📖',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  
  // Challenge Awards
  {
    id: 'challenge_accepted',
    name: 'Challenge Accepted',
    description: 'Complete your first challenge quiz',
    icon: '🎮',
    unlocked: false,
  },
  {
    id: 'challenge_master',
    name: 'Challenge Master',
    description: 'Win 10 challenge quizzes',
    icon: '🏁',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'underdog_victory',
    name: 'Underdog Victory',
    description: 'Win a challenge against a higher-level player',
    icon: '🐶',
    unlocked: false,
  },
  
  // Engagement Awards
  {
    id: 'daily_devotee',
    name: 'Daily Devotee',
    description: 'Log in for 30 consecutive days',
    icon: '📆',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'feedback_friend',
    name: 'Feedback Friend',
    description: 'Provide feedback on 5 quizzes',
    icon: '💬',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'profile_perfectionist',
    name: 'Profile Perfectionist',
    description: 'Complete all profile information',
    icon: '👤',
    unlocked: false,
  },
  
  // Special Event Awards
  {
    id: 'birthday_brainiac',
    name: 'Birthday Brainiac',
    description: 'Complete a quiz on your birthday',
    icon: '🎂',
    unlocked: false,
  },
  {
    id: 'app_anniversary',
    name: 'App Anniversary',
    description: 'Be active on the app anniversary',
    icon: '🎊',
    unlocked: false,
  },
  {
    id: 'new_year_scholar',
    name: 'New Year Scholar',
    description: 'Complete a quiz on New Years Day',
    icon: '🎆',
    unlocked: false,
  }
];

// Initialize a default profile if none exists
const initializeProfile = async (): Promise<UserProfile> => {
  const defaultProfile: UserProfile = {
    id: '1',
    name: 'Quiz User',
    email: 'user@example.com',
    level: 1,
    stats: {
      totalQuizzes: 0,
      correctAnswers: 0,
      totalTime: 0,
      overallAccuracy: 0,
      practiceAccuracy: 0,
      testAccuracy: 0,
      streak: 0,
      weeklyQuizzes: 0,
      xp: 0,
    },
    awards: DEFAULT_AWARDS,
    createdAt: new Date(),
    lastActive: new Date(),
  };

  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
};

// Get the user profile, creating a default one if it doesn't exist
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const profileData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    
    if (profileData) {
      const profile = JSON.parse(profileData);
      // Convert string dates back to Date objects
      profile.createdAt = new Date(profile.createdAt);
      profile.lastActive = new Date(profile.lastActive);
      profile.awards.forEach((award: UserAward) => {
        if (award.unlockedAt) {
          award.unlockedAt = new Date(award.unlockedAt);
        }
      });
      return profile;
    }
    
    // If no profile exists, create and return a default one
    return await initializeProfile();
  } catch (error) {
    console.error('Error getting user profile:', error);
    return await initializeProfile();
  }
};

// Save the user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    // Update lastActive date
    profile.lastActive = new Date();
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

// Update user stats after completing a quiz
export const updateUserStats = async (
  correctAnswers: number,
  totalQuestions: number,
  timeSpentInMinutes: number,
  mode: 'Practice' | 'Test'
): Promise<UserProfile> => {
  const profile = await getUserProfile();
  const stats = profile.stats;
  
  // Add logging to debug time calculation
  console.log('[TIME_DEBUG] Time received in updateUserStats (min):', timeSpentInMinutes);
  console.log('[TIME_DEBUG] Current totalTime in profile (hours):', stats.totalTime);
  console.log('[TIME_DEBUG] Time to add (hours):', timeSpentInMinutes / 60);
  
  // Update basic stats
  stats.totalQuizzes += 1;
  stats.correctAnswers += correctAnswers;
  stats.totalTime += timeSpentInMinutes / 60; // Convert to hours
  
  console.log('[TIME_DEBUG] New totalTime in profile (hours):', stats.totalTime);
  // Calculate accuracy
  const quizAccuracy = (correctAnswers / totalQuestions) * 100;
  
  // Update mode-specific accuracy
  if (mode === 'Practice') {
    stats.practiceAccuracy = calculateNewAverage(
      stats.practiceAccuracy,
      quizAccuracy,
      stats.totalQuizzes
    );
  } else {
    stats.testAccuracy = calculateNewAverage(
      stats.testAccuracy,
      quizAccuracy,
      stats.totalQuizzes
    );
  }
  
  // Update overall accuracy
  stats.overallAccuracy = calculateNewAverage(
    stats.overallAccuracy,
    quizAccuracy,
    stats.totalQuizzes
  );
  
  // Update weekly quizzes
  stats.weeklyQuizzes += 1;
  
  // Update XP (10 XP per correct answer)
  stats.xp += correctAnswers * 10;
  
  // Check for level up (every 100 XP)
  profile.level = Math.floor(stats.xp / 100) + 1;
  
  // Update streak (simplified - in a real app, you'd check the date)
  // This is just for demonstration
  stats.streak += 1;
  
  // Save updated profile
  await saveUserProfile(profile);
  
  // Check for awards
  await checkForAwards(profile, {
    correctAnswers,
    totalQuestions,
    quizAccuracy,
    timeSpentInMinutes,
    mode,
  });
  
  return profile;
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

// Check and update awards based on user performance
export const checkForAwards = async (
  profile: UserProfile,
  quizData: {
    correctAnswers: number;
    totalQuestions: number;
    quizAccuracy: number;
    timeSpentInMinutes: number;
    mode: 'Practice' | 'Test';
  }
): Promise<UserProfile> => {
  const { correctAnswers, totalQuestions, quizAccuracy, timeSpentInMinutes, mode } = quizData;
  const stats = profile.stats;
  const updatedAwards = [...profile.awards];
  let awardUnlocked = false;
  
  // Helper function to unlock an award
  const unlockAward = (award: UserAward | undefined) => {
    if (award && !award.unlocked) {
      award.unlocked = true;
      award.unlockedAt = new Date();
      awardUnlocked = true;
      return true;
    }
    return false;
  };
  
  // Helper function to update progress on an award
  const updateProgress = (award: UserAward | undefined, currentProgress: number) => {
    if (award && !award.unlocked && award.maxProgress !== undefined) {
      award.progress = currentProgress;
      if (currentProgress >= award.maxProgress) {
        unlockAward(award);
      }
      return true;
    }
    return false;
  };
  
  // Basic Awards
  // -------------
  
  // First Quiz Award
  const firstQuizAward = updatedAwards.find(award => award.id === 'first_quiz');
  if (stats.totalQuizzes === 1) {
    unlockAward(firstQuizAward);
  }
  
  // Perfect Score Award
  const perfectScoreAward = updatedAwards.find(award => award.id === 'perfect_score');
  if (quizAccuracy === 100 && totalQuestions >= 5) {
    unlockAward(perfectScoreAward);
  }
  
  // Perfect 10 Award (track progress for 10 perfect scores)
  const perfect10Award = updatedAwards.find(award => award.id === 'perfect_10');
  if (perfect10Award && quizAccuracy === 100 && totalQuestions >= 5) {
    const currentProgress = (perfect10Award.progress || 0) + 1;
    updateProgress(perfect10Award, currentProgress);
  }
  
  // Streak Awards
  // -------------
  
  // Weekly Warrior (7-day streak)
  const streakAward = updatedAwards.find(award => award.id === 'streak_7');
  updateProgress(streakAward, stats.streak);
  
  // Monthly Master (30-day streak)
  const monthlyStreakAward = updatedAwards.find(award => award.id === 'streak_30');
  updateProgress(monthlyStreakAward, stats.streak);
  
  // Century Club (100-day streak)
  const centuryStreakAward = updatedAwards.find(award => award.id === 'streak_100');
  updateProgress(centuryStreakAward, stats.streak);
  
  // Quiz Quantity Awards
  // -------------------
  
  // Quiz Master Award (50 quizzes)
  const quizMasterAward = updatedAwards.find(award => award.id === 'quiz_master');
  updateProgress(quizMasterAward, stats.totalQuizzes);
  
  // Speed Awards
  // ------------
  
  // Speed Demon Award (complete quiz in under 2 minutes with at least 5 questions)
  const speedDemonAward = updatedAwards.find(award => award.id === 'speed_demon');
  if (timeSpentInMinutes < 2 && totalQuestions >= 5 && quizAccuracy >= 70) {
    unlockAward(speedDemonAward);
  }
  
  // Lightning Fast Award (track progress for 20 fast answers)
  const lightningFastAward = updatedAwards.find(award => award.id === 'lightning_fast');
  if (lightningFastAward && timeSpentInMinutes / totalQuestions < 0.5) { // Less than 30 seconds per question
    const currentProgress = (lightningFastAward.progress || 0) + correctAnswers;
    updateProgress(lightningFastAward, currentProgress);
  }
  
  // Marathon Runner Award (complete a quiz with 50+ questions)
  const marathonAward = updatedAwards.find(award => award.id === 'marathon_runner');
  if (totalQuestions >= 50) {
    unlockAward(marathonAward);
  }
  
  // Time-based Awards
  // ----------------
  
  const currentHour = new Date().getHours();
  
  // Night Owl Award (after 10 PM)
  const nightOwlAward = updatedAwards.find(award => award.id === 'night_owl');
  if (currentHour >= 22) {
    unlockAward(nightOwlAward);
  }
  
  // Early Bird Award (before 8 AM)
  const earlyBirdAward = updatedAwards.find(award => award.id === 'early_bird');
  if (currentHour < 8) {
    unlockAward(earlyBirdAward);
  }
  
  // Mode-specific Awards
  // -------------------
  
  // Test Champion Award (score over 90% in Test mode)
  const testChampionAward = updatedAwards.find(award => award.id === 'test_champion');
  if (mode === 'Test' && quizAccuracy > 90 && totalQuestions >= 10) {
    unlockAward(testChampionAward);
  }
  
  // Accuracy Awards
  // --------------
  
  // Accuracy King Award (maintain 90% accuracy over 10 quizzes)
  const accuracyKingAward = updatedAwards.find(award => award.id === 'accuracy_king');
  if (stats.overallAccuracy >= 90 && stats.totalQuizzes >= 10) {
    unlockAward(accuracyKingAward);
  }
  
  // Flawless Victory Award (track progress for 5 perfect quizzes in a row)
  const flawlessAward = updatedAwards.find(award => award.id === 'flawless_victory');
  if (flawlessAward) {
    if (quizAccuracy === 100 && totalQuestions >= 5) {
      const currentProgress = (flawlessAward.progress || 0) + 1;
      updateProgress(flawlessAward, currentProgress);
    } else {
      // Reset progress if not a perfect score
      flawlessAward.progress = 0;
    }
  }
  
  // Comeback Kid Award (score 90%+ after previously failing the same quiz)
  // Note: This would require tracking previous quiz attempts by topic/subject
  // This is a simplified implementation
  const comebackAward = updatedAwards.find(award => award.id === 'comeback_kid');
  // Implementation would go here in a real app
  
  // Track which awards were unlocked in this session
  const newlyUnlockedAwards = updatedAwards.filter(award => 
    award.unlocked && award.unlockedAt && 
    new Date().getTime() - award.unlockedAt.getTime() < 5000 // Awards unlocked in the last 5 seconds
  );
  
  // If any award was unlocked, save the profile
  if (awardUnlocked) {
    profile.awards = updatedAwards;
    await saveUserProfile(profile);
    
    // Return the newly unlocked awards so they can be displayed to the user
    profile.newlyUnlockedAwards = newlyUnlockedAwards;
  } else {
    profile.newlyUnlockedAwards = [];
  }
  
  return profile;
};


// Reset user profile (for testing or user request)
export const resetUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    await initializeProfile();
  } catch (error) {
    console.error('Error resetting user profile:', error);
  }
};
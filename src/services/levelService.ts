import { UserProfile } from '../types/profile';

interface LevelMetrics {
  xp: number;
  accuracy: number;
  timeSpent: number;
  awards: number;
  totalQuizzes: number;
  streak: number;
}

const WEIGHTS = {
  xp: 0.35,
  accuracy: 0.25,
  timeSpent: 0.15,
  awards: 0.1,
  totalQuizzes: 0.1,
  streak: 0.05,
};

const XP_PER_LEVEL = 100;
const BASE_LEVEL_THRESHOLD = 1000;
const LEVEL_MULTIPLIER = 1.5;

export const calculateLevel = (metrics: LevelMetrics): number => {
  // Calculate base level from XP
  const xpLevel = Math.floor(metrics.xp / XP_PER_LEVEL);

  // Calculate weighted score for other metrics
  const weightedScore =
    (metrics.accuracy * WEIGHTS.accuracy) +
    (Math.min(metrics.timeSpent / 50, 1) * WEIGHTS.timeSpent) +
    (Math.min(metrics.awards * 10, 100) * WEIGHTS.awards) +
    (Math.min(metrics.totalQuizzes / 100, 1) * WEIGHTS.totalQuizzes) +
    (Math.min(metrics.streak / 30, 1) * WEIGHTS.streak);

  // Calculate bonus levels from weighted score
  const bonusLevels = Math.floor(weightedScore * 5);

  return xpLevel + bonusLevels;
};

export const calculateLevelProgress = (metrics: LevelMetrics): number => {
  const currentLevel = calculateLevel(metrics);
  const nextLevelThreshold = BASE_LEVEL_THRESHOLD * Math.pow(LEVEL_MULTIPLIER, currentLevel);
  const currentLevelThreshold = BASE_LEVEL_THRESHOLD * Math.pow(LEVEL_MULTIPLIER, currentLevel - 1);
  
  const progress = ((metrics.xp - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const calculateLevelRewards = (level: number): { xpBonus: number; title: string } => {
  const xpBonus = Math.floor(10 * Math.pow(1.2, level));
  
  const titles = [
    'Novice',
    'Apprentice',
    'Scholar',
    'Expert',
    'Master',
    'Grandmaster',
    'Sage',
    'Enlightened',
    'Legendary',
  ];

  const titleIndex = Math.min(Math.floor(level / 10), titles.length - 1);
  return {
    xpBonus,
    title: titles[titleIndex],
  };
};

export const updateUserLevel = (profile: UserProfile): UserProfile => {
  const metrics: LevelMetrics = {
    xp: profile.stats.xp,
    accuracy: profile.stats.overallAccuracy,
    timeSpent: profile.stats.totalTime,
    awards: profile.stats.awards,
    totalQuizzes: profile.stats.totalQuizzes,
    streak: profile.stats.streak,
  };

  const newLevel = calculateLevel(metrics);
  const levelProgress = calculateLevelProgress(metrics);
  const rewards = calculateLevelRewards(newLevel);

  return {
    ...profile,
    level: newLevel,
    levelProgress,
    title: rewards.title,
    xpMultiplier: 1 + (rewards.xpBonus / 100),
  };
};
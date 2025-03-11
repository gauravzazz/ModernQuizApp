export interface UserStats {
  totalQuizzes: number;
  correctAnswers: number;
  totalTime: number; // in hours
  overallAccuracy: number;
  practiceAccuracy: number;
  testAccuracy: number;
  streak: number;
  weeklyQuizzes: number;
  xp: number;
}

export interface UserAward {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  stats: UserStats;
  awards: UserAward[];
  createdAt: Date;
  lastActive: Date;
  newlyUnlockedAwards?: UserAward[];
}
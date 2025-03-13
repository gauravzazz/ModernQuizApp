import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types/quiz';

// Storage keys
const ANALYTICS_KEYS = {
  OVERALL_STATS: '@quiz_overall_stats',
  SUBJECT_STATS: '@quiz_subject_stats_',
  TOPIC_STATS: '@quiz_topic_stats_',
  TIME_STATS: '@quiz_time_stats',
  STREAK_STATS: '@quiz_streak_stats',
  ACHIEVEMENT_STATS: '@quiz_achievement_stats'
};

export interface QuizAnalytics {
  correct: number;
  total: number;
  averageTime: number;
  fastestTime: number;
  slowestTime: number;
  practiceCount: number;
  testCount: number;
  lastAttemptDate?: string;
  streak: number;
  accuracy: number;
}

interface TimeAnalytics {
  questionId: string;
  time: number;
  isCorrect: boolean;
}

export interface QuizSubmissionData {
  quizId?: string;
  subjectId?: string;
  topicId?: string;
  mode: 'Practice' | 'Test';
  questions: Question[];
  answers: Record<string, string>;
  timePerQuestion: Record<string, number>;
  startTime: number;
  endTime: number;
}

export class AnalyticsEngine {
  private static instance: AnalyticsEngine;

  private constructor() {}

  public static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  private async getStats(key: string): Promise<QuizAnalytics> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Error retrieving stats for ${key}:`, error);
    }

    return {
      correct: 0,
      total: 0,
      averageTime: 0,
      fastestTime: 0,
      slowestTime: 0,
      practiceCount: 0,
      testCount: 0,
      streak: 0,
      accuracy: 0
    };
  }

  public async getSubjectIdFromTopicId(topicId: string): Promise<string | null> {
    try {
      const key = ANALYTICS_KEYS.TOPIC_STATS + topicId;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const stats = JSON.parse(data);
        if (stats.subjectId) {
          return stats.subjectId;
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting subject ID for topic ${topicId}:`, error);
      return null;
    }
  }

  private async updateStats(key: string, newData: Partial<QuizAnalytics>): Promise<void> {
    try {
      const currentStats = await this.getStats(key);
      const updatedStats = { ...currentStats, ...newData };
      await AsyncStorage.setItem(key, JSON.stringify(updatedStats));
    } catch (error) {
      console.error(`Error updating stats for ${key}:`, error);
    }
  }

  private calculateAccuracy(correct: number, total: number): number {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }

  private calculateTimeStats(timeData: TimeAnalytics[]): {
    averageTime: number;
    fastestTime: number;
    slowestTime: number;
  } {
    if (timeData.length === 0) {
      return { averageTime: 0, fastestTime: 0, slowestTime: 0 };
    }

    const times = timeData.map(t => t.time);
    return {
      averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      fastestTime: Math.min(...times),
      slowestTime: Math.max(...times)
    };
  }

  private async updateStreak(correct: number, total: number): Promise<void> {
    const stats = await this.getStats(ANALYTICS_KEYS.STREAK_STATS);
    const today = new Date().toISOString().split('T')[0];
    const lastAttempt = stats.lastAttemptDate;

    let newStreak = stats.streak;
    if (correct / total >= 0.7) { // 70% accuracy threshold for maintaining streak
      if (lastAttempt === undefined || lastAttempt !== today) {
        newStreak++;
      }
    } else {
      newStreak = 0;
    }

    await this.updateStats(ANALYTICS_KEYS.STREAK_STATS, {
      streak: newStreak,
      lastAttemptDate: today
    });
  }

  public async processQuizSubmission(data: QuizSubmissionData): Promise<void> {
    const {
      subjectId,
      topicId,
      mode,
      questions,
      answers,
      timePerQuestion,
      startTime,
      endTime
    } = data;

    // Calculate basic metrics
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(
      q => answers[q.id] === q.correctOptionId
    ).length;

    // Prepare time analytics
    const timeAnalytics: TimeAnalytics[] = questions.map(q => ({
      questionId: q.id,
      time: timePerQuestion[q.id],
      isCorrect: answers[q.id] === q.correctOptionId
    }));

    // Calculate time stats
    const timeStats = this.calculateTimeStats(timeAnalytics);

    // Update overall stats
    const overallStats = await this.getStats(ANALYTICS_KEYS.OVERALL_STATS);
    await this.updateStats(ANALYTICS_KEYS.OVERALL_STATS, {
      correct: overallStats.correct + correctAnswers,
      total: overallStats.total + totalQuestions,
      accuracy: this.calculateAccuracy(
        overallStats.correct + correctAnswers,
        overallStats.total + totalQuestions
      ),
      ...(mode === 'Practice'
        ? { practiceCount: overallStats.practiceCount + 1 }
        : { testCount: overallStats.testCount + 1 }),
      ...timeStats
    });

    // Update subject stats if available
    if (subjectId) {
      const subjectKey = ANALYTICS_KEYS.SUBJECT_STATS + subjectId;
      const subjectStats = await this.getStats(subjectKey);
      await this.updateStats(subjectKey, {
        correct: subjectStats.correct + correctAnswers,
        total: subjectStats.total + totalQuestions,
        accuracy: this.calculateAccuracy(
          subjectStats.correct + correctAnswers,
          subjectStats.total + totalQuestions
        ),
        ...timeStats
      });
    }

    // Update topic stats if available
    if (topicId) {
      const topicKey = ANALYTICS_KEYS.TOPIC_STATS + topicId;
      const topicStats = await this.getStats(topicKey);
      await this.updateStats(topicKey, {
        correct: topicStats.correct + correctAnswers,
        total: topicStats.total + totalQuestions,
        accuracy: this.calculateAccuracy(
          topicStats.correct + correctAnswers,
          topicStats.total + totalQuestions
        ),
        ...timeStats
      });
    }

    // Update streak
    await this.updateStreak(correctAnswers, totalQuestions);

    // Store time analytics for detailed analysis
    await AsyncStorage.setItem(
      ANALYTICS_KEYS.TIME_STATS,
      JSON.stringify(timeAnalytics)
    );
  }

  public async getOverallStats(): Promise<QuizAnalytics> {
    return this.getStats(ANALYTICS_KEYS.OVERALL_STATS);
  }

  public async getSubjectStats(subjectId: string): Promise<QuizAnalytics> {
    return this.getStats(ANALYTICS_KEYS.SUBJECT_STATS + subjectId);
  }

  public async getTopicStats(topicId: string): Promise<QuizAnalytics> {
    return this.getStats(ANALYTICS_KEYS.TOPIC_STATS + topicId);
  }

  public async getStreak(): Promise<number> {
    const stats = await this.getStats(ANALYTICS_KEYS.STREAK_STATS);
    return stats.streak;
  }
}

export const analyticsEngine = AnalyticsEngine.getInstance();
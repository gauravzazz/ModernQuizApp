import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types/quiz';
import { enhancedAnalyticsEngine } from './enhancedAnalyticsService';

// Storage keys for granular analytics
const ANALYTICS_KEYS = {
  SUBJECT_ANALYTICS: '@quiz_subject_analytics_',
  TOPIC_ANALYTICS: '@quiz_topic_analytics_',
  QUESTION_ANALYTICS: '@quiz_question_analytics_',
  DAILY_STATS: '@quiz_daily_stats_',
  WEEKLY_STATS: '@quiz_weekly_stats_',
  MONTHLY_STATS: '@quiz_monthly_stats_',
  LEARNING_CURVE: '@quiz_learning_curve_',
  MASTERY_PROGRESS: '@quiz_mastery_progress_',
};

// Interfaces for different analytics levels
export interface SubjectAnalytics {
  subjectId: string;
  title: string;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  streak: number;
  masteryLevel: number;
  topicsProgress: Record<string, number>; // topicId -> progress (0-1)
  lastAttemptDate: string;
  timeSpent: number; // in seconds
  strengthAreas: string[];
  weaknessAreas: string[];
  improvementRate: number; // percentage improvement over time
  quizHistory: QuizHistoryItem[];
}

export interface TopicAnalytics {
  topicId: string;
  subjectId: string;
  title: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  averageScore: number;
  averageTime: number; // in seconds per question
  masteryLevel: number;
  lastAttemptDate: string;
  difficultyRating: number; // 1-5 scale
  confidenceScore: number; // 0-100
  quizHistory: QuizHistoryItem[];
}

export interface QuestionAnalytics {
  questionId: string;
  topicId: string;
  subjectId: string;
  attempts: number;
  correctAttempts: number;
  averageTime: number;
  lastAttemptDate: string;
  difficulty: number;
  tags: string[];
  confidenceLevel: number;
  masteryProgress: number;
}

export interface QuizHistoryItem {
  date: string;
  score: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface DailyStats {
  date: string;
  quizzesTaken: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  subjectsStudied: string[];
}

class GranularAnalyticsService {
  private static instance: GranularAnalyticsService;

  private constructor() {}

  public static getInstance(): GranularAnalyticsService {
    if (!GranularAnalyticsService.instance) {
      GranularAnalyticsService.instance = new GranularAnalyticsService();
    }
    return GranularAnalyticsService.instance;
  }

  // Get subject analytics
  public async getSubjectAnalytics(subjectId: string): Promise<SubjectAnalytics | null> {
    try {
      const key = ANALYTICS_KEYS.SUBJECT_ANALYTICS + subjectId;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error retrieving subject analytics for ${subjectId}:`, error);
      return null;
    }
  }

  // Get all subjects analytics
  public async getAllSubjectsAnalytics(): Promise<SubjectAnalytics[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const subjectKeys = keys.filter(key => 
        key.startsWith(ANALYTICS_KEYS.SUBJECT_ANALYTICS)
      );
      
      const results = await AsyncStorage.multiGet(subjectKeys);
      return results
        .map(([_, value]) => (value ? JSON.parse(value) : null))
        .filter((item): item is SubjectAnalytics => item !== null)
        .sort((a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime());
    } catch (error) {
      console.error('Error retrieving all subjects analytics:', error);
      return [];
    }
  }

  // Get topic analytics
  public async getTopicAnalytics(topicId: string): Promise<TopicAnalytics | null> {
    try {
      const key = ANALYTICS_KEYS.TOPIC_ANALYTICS + topicId;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error retrieving topic analytics for ${topicId}:`, error);
      return null;
    }
  }

  // Get all topics for a subject
  public async getSubjectTopicsAnalytics(subjectId: string): Promise<TopicAnalytics[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const topicKeys = keys.filter(key => 
        key.startsWith(ANALYTICS_KEYS.TOPIC_ANALYTICS)
      );
      
      const results = await AsyncStorage.multiGet(topicKeys);
      return results
        .map(([_, value]) => (value ? JSON.parse(value) : null))
        .filter((item): item is TopicAnalytics => 
          item !== null && item.subjectId === subjectId
        )
        .sort((a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime());
    } catch (error) {
      console.error(`Error retrieving topics for subject ${subjectId}:`, error);
      return [];
    }
  }

  // Get question analytics
  public async getQuestionAnalytics(questionId: string): Promise<QuestionAnalytics | null> {
    try {
      const key = ANALYTICS_KEYS.QUESTION_ANALYTICS + questionId;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error retrieving question analytics for ${questionId}:`, error);
      return null;
    }
  }

  // Get daily stats
  public async getDailyStats(date: string): Promise<DailyStats | null> {
    try {
      const key = ANALYTICS_KEYS.DAILY_STATS + date;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error retrieving daily stats for ${date}:`, error);
      return null;
    }
  }

  // Get last 7 days stats
  public async getWeeklyStats(): Promise<DailyStats[]> {
    try {
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      const keys = dates.map(date => ANALYTICS_KEYS.DAILY_STATS + date);
      const results = await AsyncStorage.multiGet(keys);
      
      return results
        .map(([key, value], index) => {
          if (value) {
            return JSON.parse(value);
          }
          // Return empty stats for days with no data
          return {
            date: dates[index],
            quizzesTaken: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            timeSpent: 0,
            subjectsStudied: [],
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error retrieving weekly stats:', error);
      return [];
    }
  }

  // Update subject analytics after a quiz
  public async updateSubjectAnalytics(params: {
    subjectId: string;
    title: string;
    score: number;
    timeSpent: number;
    correctAnswers: number;
    totalQuestions: number;
    topicId?: string;
  }): Promise<void> {
    const { subjectId, title, score, timeSpent, correctAnswers, totalQuestions, topicId } = params;
    const key = ANALYTICS_KEYS.SUBJECT_ANALYTICS + subjectId;
    const today = new Date().toISOString().split('T')[0];

    try {
      // Get existing data or create new
      const existingData = await this.getSubjectAnalytics(subjectId);
      
      const newQuizHistoryItem: QuizHistoryItem = {
        date: new Date().toISOString(),
        score,
        timeSpent,
        correctAnswers,
        totalQuestions,
      };

      let updatedData: SubjectAnalytics;
      
      if (existingData) {
        // Check if streak should be incremented
        const lastAttemptDate = new Date(existingData.lastAttemptDate).toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = existingData.streak;
        if (lastAttemptDate === yesterdayStr) {
          // Consecutive day, increment streak
          newStreak += 1;
        } else if (lastAttemptDate !== today) {
          // Not consecutive and not today, reset streak
          newStreak = 1;
        }
        // If last attempt was today, keep streak the same

        // Update topic progress if topicId is provided
        const topicsProgress = { ...existingData.topicsProgress };
        if (topicId) {
          topicsProgress[topicId] = score / 100; // Convert score to 0-1 range
        }

        // Calculate improvement rate
        const previousScores = existingData.quizHistory.slice(-5).map(item => item.score);
        const avgPreviousScore = previousScores.length > 0 
          ? previousScores.reduce((sum, s) => sum + s, 0) / previousScores.length 
          : score;
        const improvementRate = previousScores.length > 0 
          ? ((score - avgPreviousScore) / avgPreviousScore) * 100 
          : 0;

        // Update analytics
        updatedData = {
          ...existingData,
          completedQuizzes: existingData.completedQuizzes + 1,
          averageScore: ((existingData.averageScore * existingData.completedQuizzes) + score) / (existingData.completedQuizzes + 1),
          streak: newStreak,
          lastAttemptDate: new Date().toISOString(),
          timeSpent: existingData.timeSpent + timeSpent,
          topicsProgress,
          improvementRate,
          quizHistory: [...existingData.quizHistory, newQuizHistoryItem].slice(-20), // Keep last 20 quizzes
        };
      } else {
        // Create new subject analytics
        const topicsProgress: Record<string, number> = {};
        if (topicId) {
          topicsProgress[topicId] = score / 100;
        }

        updatedData = {
          subjectId,
          title,
          totalQuizzes: 0, // Will be updated when we have topic data
          completedQuizzes: 1,
          averageScore: score,
          streak: 1,
          masteryLevel: 0, // Will be calculated later
          topicsProgress,
          lastAttemptDate: new Date().toISOString(),
          timeSpent,
          strengthAreas: [],
          weaknessAreas: [],
          improvementRate: 0,
          quizHistory: [newQuizHistoryItem],
        };
      }

      // Save updated data
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));

      // Update daily stats
      await this.updateDailyStats({
        date: today,
        quizzesTaken: 1,
        questionsAnswered: totalQuestions,
        correctAnswers,
        timeSpent,
        subjectId,
      });

    } catch (error) {
      console.error(`Error updating subject analytics for ${subjectId}:`, error);
    }
  }

  // Update topic analytics after a quiz
  public async updateTopicAnalytics(params: {
    topicId: string;
    subjectId: string;
    title: string;
    score: number;
    timeSpent: number;
    correctAnswers: number;
    totalQuestions: number;
    questions: Question[];
    answers: Record<string, string>;
    timePerQuestion: Record<string, number>;
  }): Promise<void> {
    const { 
      topicId, 
      subjectId, 
      title, 
      score, 
      timeSpent, 
      correctAnswers, 
      totalQuestions,
      questions,
      answers,
      timePerQuestion
    } = params;
    const key = ANALYTICS_KEYS.TOPIC_ANALYTICS + topicId;

    try {
      // Get existing data or create new
      const existingData = await this.getTopicAnalytics(topicId);
      
      const newQuizHistoryItem: QuizHistoryItem = {
        date: new Date().toISOString(),
        score,
        timeSpent,
        correctAnswers,
        totalQuestions,
      };

      // Calculate average time per question
      const avgTimePerQuestion = Object.values(timePerQuestion).reduce((sum, time) => sum + time, 0) / totalQuestions;

      // Calculate confidence score based on time and correctness
      const confidenceScore = this.calculateConfidenceScore(timePerQuestion, answers, questions);

      let updatedData: TopicAnalytics;
      
      if (existingData) {
        // Update analytics
        updatedData = {
          ...existingData,
          attemptedQuestions: existingData.attemptedQuestions + totalQuestions,
          correctAnswers: existingData.correctAnswers + correctAnswers,
          averageScore: ((existingData.averageScore * existingData.attemptedQuestions) + score * totalQuestions) / (existingData.attemptedQuestions + totalQuestions),
          averageTime: ((existingData.averageTime * existingData.attemptedQuestions) + avgTimePerQuestion * totalQuestions) / (existingData.attemptedQuestions + totalQuestions),
          lastAttemptDate: new Date().toISOString(),
          confidenceScore: (existingData.confidenceScore + confidenceScore) / 2, // Average with previous
          quizHistory: [...existingData.quizHistory, newQuizHistoryItem].slice(-20), // Keep last 20 quizzes
        };
      } else {
        // Create new topic analytics
        updatedData = {
          topicId,
          subjectId,
          title,
          totalQuestions: 0, // Will be updated when we have question data
          attemptedQuestions: totalQuestions,
          correctAnswers,
          averageScore: score,
          averageTime: avgTimePerQuestion,
          masteryLevel: 0, // Will be calculated later
          lastAttemptDate: new Date().toISOString(),
          difficultyRating: questions.reduce((sum, q) => sum + (q.difficulty || 1), 0) / questions.length,
          confidenceScore,
          quizHistory: [newQuizHistoryItem],
        };
      }

      // Save updated data
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));

      // Update question analytics for each question
      for (const question of questions) {
        await this.updateQuestionAnalytics({
          questionId: question.id,
          topicId,
          subjectId,
          isCorrect: answers[question.id] === question.correctOptionId,
          timeSpent: timePerQuestion[question.id] || 0,
          difficulty: question.difficulty || 1,
          tags: question.tags || [],
        });
      }

    } catch (error) {
      console.error(`Error updating topic analytics for ${topicId}:`, error);
    }
  }

  // Update question analytics after a quiz
  public async updateQuestionAnalytics(params: {
    questionId: string;
    topicId: string;
    subjectId: string;
    isCorrect: boolean;
    timeSpent: number;
    difficulty: number;
    tags: string[];
  }): Promise<void> {
    const { questionId, topicId, subjectId, isCorrect, timeSpent, difficulty, tags } = params;
    const key = ANALYTICS_KEYS.QUESTION_ANALYTICS + questionId;

    try {
      // Get existing data or create new
      const existingData = await this.getQuestionAnalytics(questionId);

      let updatedData: QuestionAnalytics;
      
      if (existingData) {
        // Update analytics
        updatedData = {
          ...existingData,
          attempts: existingData.attempts + 1,
          correctAttempts: existingData.correctAttempts + (isCorrect ? 1 : 0),
          averageTime: ((existingData.averageTime * existingData.attempts) + timeSpent) / (existingData.attempts + 1),
          lastAttemptDate: new Date().toISOString(),
          // Update confidence level based on time and correctness
          confidenceLevel: isCorrect 
            ? Math.min(100, existingData.confidenceLevel + 5) 
            : Math.max(0, existingData.confidenceLevel - 5),
          // Update mastery progress
          masteryProgress: isCorrect 
            ? Math.min(1, existingData.masteryProgress + 0.05) 
            : Math.max(0, existingData.masteryProgress - 0.02),
        };
      } else {
        // Create new question analytics
        updatedData = {
          questionId,
          topicId,
          subjectId,
          attempts: 1,
          correctAttempts: isCorrect ? 1 : 0,
          averageTime: timeSpent,
          lastAttemptDate: new Date().toISOString(),
          difficulty,
          tags,
          confidenceLevel: isCorrect ? 60 : 30, // Initial confidence level
          masteryProgress: isCorrect ? 0.1 : 0.05, // Initial mastery progress
        };
      }

      // Save updated data
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));

    } catch (error) {
      console.error(`Error updating question analytics for ${questionId}:`, error);
    }
  }

  // Update daily stats
  private async updateDailyStats(params: {
    date: string;
    quizzesTaken: number;
    questionsAnswered: number;
    correctAnswers: number;
    timeSpent: number;
    subjectId: string;
  }): Promise<void> {
    const { date, quizzesTaken, questionsAnswered, correctAnswers, timeSpent, subjectId } = params;
    const key = ANALYTICS_KEYS.DAILY_STATS + date;

    try {
      // Get existing data or create new
      const existingData = await this.getDailyStats(date);

      let updatedData: DailyStats;
      
      if (existingData) {
        // Update existing stats
        const subjectsStudied = new Set([...existingData.subjectsStudied, subjectId]);
        
        updatedData = {
          ...existingData,
          quizzesTaken: existingData.quizzesTaken + quizzesTaken,
          questionsAnswered: existingData.questionsAnswered + questionsAnswered,
          correctAnswers: existingData.correctAnswers + correctAnswers,
          timeSpent: existingData.timeSpent + timeSpent,
          subjectsStudied: Array.from(subjectsStudied),
        };
      } else {
        // Create new daily stats
        updatedData = {
          date,
          quizzesTaken,
          questionsAnswered,
          correctAnswers,
          timeSpent,
          subjectsStudied: [subjectId],
        };
      }

      // Save updated data
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));

    } catch (error) {
      console.error(`Error updating daily stats for ${date}:`, error);
    }
  }

  // Calculate confidence score based on time and correctness
  private calculateConfidenceScore(timePerQuestion: Record<string, number>, answers: Record<string, string>, questions: Question[]): number {
    const scores = questions.map(q => {
      const time = timePerQuestion[q.id] || 0;
      const isCorrect = answers[q.id] === q.correctOptionId;
      const averageTime = 30; // baseline average time in seconds
      
      // Factor in answer speed and correctness
      let score = isCorrect ? 1 : 0;
      if (time < averageTime && isCorrect) score += 0.5;
      if (time > averageTime * 2) score -= 0.2;
      
      return Math.max(0, Math.min(1, score));
    });
    
    return (scores.reduce((a, b) => a + b, 0) / questions.length) * 100;
  }

  // Process quiz results and update all analytics levels
  public async processQuizResults(params: {
    quizId: string;
    subjectId: string;
    subjectTitle: string;
    topicId?: string;
    topicTitle?: string;
    questions: Question[];
    answers: Record<string, string>;
    timePerQuestion: Record<string, number>;
    totalTime: number;
    mode: 'Practice' | 'Test';
  }): Promise<void> {
    const { 
      quizId, 
      subjectId, 
      subjectTitle, 
      topicId, 
      topicTitle, 
      questions, 
      answers, 
      timePerQuestion, 
      totalTime,
      mode 
    } = params;

    // Calculate score and other metrics
    const correctAnswers = questions.filter(q => answers[q.id] === q.correctOptionId).length;
    const score = (correctAnswers / questions.length) * 100;

    // Update subject analytics
    await this.updateSubjectAnalytics({
      subjectId,
      title: subjectTitle,
      score,
      timeSpent: totalTime,
      correctAnswers,
      totalQuestions: questions.length,
      topicId,
    });

    // Update topic analytics if topicId is provided
    if (topicId && topicTitle) {
      await this.updateTopicAnalytics({
        topicId,
        subjectId,
        title: topicTitle,
        score,
        timeSpent: totalTime,
        correctAnswers,
        totalQuestions: questions.length,
        questions,
        answers,
        timePerQuestion,
      });
    }

    // Also update enhanced analytics
    await enhancedAnalyticsEngine.processQuizResults({
      quizId,
      questions,
      answers,
      timePerQuestion,
      totalTime,
      subjectId,
      topicId
    });
  }
  
  public async saveQuizAnalytics(data: {
    subjectId: string;
    topicId: string;
    accuracy: number;
    timePerQuestion: Record<string, number>;
    totalTime: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedAnswers: number;
    difficultyScore: number;
    confidenceScore: number;
    masteryLevel: number;
    timestamp: number;
  }): Promise<void> {
    try {
      const {
        subjectId,
        topicId,
        accuracy,
        timePerQuestion,
        totalTime,
        correctAnswers,
        incorrectAnswers,
        skippedAnswers,
        difficultyScore,
        confidenceScore,
        masteryLevel,
        timestamp
      } = data;

      // Calculate total questions
      const totalQuestions = correctAnswers + incorrectAnswers + skippedAnswers;
      const score = accuracy;

      // Update subject analytics
      await this.updateSubjectAnalytics({
        subjectId,
        title: '', // Will be updated by the subject service
        score,
        timeSpent: totalTime,
        correctAnswers,
        totalQuestions,
        topicId
      });

      // Update topic analytics
      await this.updateTopicAnalytics({
        topicId,
        subjectId,
        title: '', // Will be updated by the topic service
        score,
        timeSpent: totalTime,
        correctAnswers,
        totalQuestions,
        questions: [], // Will be updated when question data is available
        answers: {}, // Will be updated when answer data is available
        timePerQuestion
      });

      // Process enhanced analytics
      await enhancedAnalyticsEngine.processQuizAnalytics({
        subjectId,
        topicId,
        accuracy,
        timePerQuestion,
        totalTime,
        correctAnswers,
        incorrectAnswers,
        skippedAnswers,
        difficultyScore,
        confidenceScore,
        masteryLevel,
        timestamp
      });
    } catch (error) {
      console.error('Error saving quiz analytics:', error);
      throw error;
    }
  }
}

export const granularAnalyticsService = GranularAnalyticsService.getInstance();
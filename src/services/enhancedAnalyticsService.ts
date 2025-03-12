import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types/quiz';
import { QuizAnalytics, QuizSubmissionData } from './analyticsService';

// Enhanced Storage keys for granular analytics
const ANALYTICS_KEYS = {
  OVERALL_STATS: '@quiz_overall_stats',
  SUBJECT_STATS: '@quiz_subject_stats_',
  TOPIC_STATS: '@quiz_topic_stats_',
  QUESTION_STATS: '@quiz_question_stats_',
  SESSION_STATS: '@quiz_session_stats',
  TIME_STATS: '@quiz_time_stats',
  STREAK_STATS: '@quiz_streak_stats',
  DIFFICULTY_STATS: '@quiz_difficulty_stats_',
  LEARNING_PATTERN: '@quiz_learning_pattern_',
  ENGAGEMENT_METRICS: '@quiz_engagement_metrics',
  CONFIDENCE_SCORES: '@quiz_confidence_scores_',
  MASTERY_LEVELS: '@quiz_mastery_levels_',
  IMPROVEMENT_SUGGESTIONS: '@quiz_improvement_suggestions_'
};

interface EnhancedQuizAnalytics extends QuizAnalytics {
  confidenceScore: number;
  masteryLevel: number;
  improvementAreas: string[];
  learningCurve: number[];
  engagementScore: number;
  difficultyAdaptation: {
    current: number;
    recommended: number;
  };
  timeDistribution: {
    reading: number;
    thinking: number;
    answering: number;
  };
  behavioralMetrics: {
    answerChanges: number;
    timeouts: number;
    skips: number;
  };
}

interface QuestionAnalytics {
  questionId: string;
  attempts: number;
  correctAttempts: number;
  averageTime: number;
  timesTaken: number[];
  answerChanges: number;
  confidenceLevel: number;
  difficulty: number;
  tags: string[];
  lastAttemptDate: string;
  masteryProgress: number;
}

interface SessionMetrics {
  sessionId: string;
  startTime: number;
  endTime: number;
  focusTime: number;
  breaks: number;
  completionRate: number;
  engagementScore: number;
  learningEfficiency: number;
}

interface LearningPattern {
  preferredTimeOfDay: string;
  averageSessionDuration: number;
  frequentMistakePatterns: string[];
  strengthAreas: string[];
  weaknessAreas: string[];
  recommendedTopics: string[];
}

export class EnhancedAnalyticsEngine {
  private static instance: EnhancedAnalyticsEngine;

  private constructor() {}

  public static getInstance(): EnhancedAnalyticsEngine {
    if (!EnhancedAnalyticsEngine.instance) {
      EnhancedAnalyticsEngine.instance = new EnhancedAnalyticsEngine();
    }
    return EnhancedAnalyticsEngine.instance;
  }

  private async getEnhancedStats(key: string): Promise<EnhancedQuizAnalytics> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error(`Error retrieving enhanced stats for ${key}:`, error);
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
      accuracy: 0,
      confidenceScore: 0,
      masteryLevel: 0,
      improvementAreas: [],
      learningCurve: [],
      engagementScore: 0,
      difficultyAdaptation: {
        current: 1,
        recommended: 1
      },
      timeDistribution: {
        reading: 0,
        thinking: 0,
        answering: 0
      },
      behavioralMetrics: {
        answerChanges: 0,
        timeouts: 0,
        skips: 0
      }
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

  private async updateQuestionStats(questionId: string, data: Partial<QuestionAnalytics>): Promise<void> {
    const key = ANALYTICS_KEYS.QUESTION_STATS + questionId;
    try {
      const currentStats = await AsyncStorage.getItem(key);
      const updatedStats = {
        ...JSON.parse(currentStats || '{}'),
        ...data,
        lastAttemptDate: new Date().toISOString()
      };
      await AsyncStorage.setItem(key, JSON.stringify(updatedStats));
    } catch (error) {
      console.error(`Error updating question stats for ${questionId}:`, error);
    }
  }

  private async updateSessionMetrics(sessionData: SessionMetrics): Promise<void> {
    try {
      const key = ANALYTICS_KEYS.SESSION_STATS;
      const currentSessions = JSON.parse(
        (await AsyncStorage.getItem(key)) || '[]'
      );
      currentSessions.push(sessionData);
      await AsyncStorage.setItem(key, JSON.stringify(currentSessions));
    } catch (error) {
      console.error('Error updating session metrics:', error);
    }
  }

  private calculateConfidenceScore(timePerQuestion: Record<string, number>, answers: Record<string, string>, questions: Question[]): number {
    const scores = questions.map(q => {
      const time = timePerQuestion[q.id];
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

  private calculateMasteryLevel(stats: EnhancedQuizAnalytics): number {
    const {
      accuracy,
      confidenceScore,
      engagementScore,
      behavioralMetrics
    } = stats;
    
    // Weight different factors
    const weights = {
      accuracy: 0.4,
      confidence: 0.3,
      engagement: 0.2,
      behavior: 0.1
    };
    
    const behaviorScore = Math.max(
      0,
      100 - (behavioralMetrics.answerChanges * 5 + behavioralMetrics.timeouts * 10)
    );
    
    return (
      accuracy * weights.accuracy +
      confidenceScore * weights.confidence +
      engagementScore * weights.engagement +
      behaviorScore * weights.behavior
    );
  }

  public async getSubjectStats(subject: string): Promise<{
    streak: number;
    masteryLevel: number;
    confidenceScore: number;
    engagementScore: number;
    improvementAreas: string[];
  }> {
    try {
      const key = ANALYTICS_KEYS.SUBJECT_STATS + subject;
      const stats = await this.getEnhancedStats(key);
      
      return {
        streak: stats.streak,
        masteryLevel: stats.masteryLevel,
        confidenceScore: stats.confidenceScore,
        engagementScore: stats.engagementScore,
        improvementAreas: stats.improvementAreas
      };
    } catch (error) {
      console.error(`Error getting stats for subject ${subject}:`, error);
      return {
        streak: 0,
        masteryLevel: 0,
        confidenceScore: 0,
        engagementScore: 0,
        improvementAreas: []
      };
    }
  }

  private analyzeLearningPattern(sessionMetrics: SessionMetrics[]): LearningPattern {
    // Implement sophisticated learning pattern analysis
    // This is a placeholder implementation
    return {
      preferredTimeOfDay: 'morning',
      averageSessionDuration: 0,
      frequentMistakePatterns: [],
      strengthAreas: [],
      weaknessAreas: [],
      recommendedTopics: []
    };
  }

  public async processEnhancedQuizSubmission(data: QuizSubmissionData & {
    sessionMetrics: Partial<SessionMetrics>;
    behavioralData: {
      answerChanges: Record<string, number>;
      timeouts: string[];
      skips: string[];
    };
  }): Promise<void> {
    const {
      questions,
      answers,
      timePerQuestion,
      sessionMetrics,
      behavioralData
    } = data;

    // Calculate enhanced metrics
    const confidenceScore = this.calculateConfidenceScore(
      timePerQuestion,
      answers,
      questions
    );

    // Update question-level statistics
    for (const question of questions) {
      await this.updateQuestionStats(question.id, {
        attempts: 1,
        correctAttempts: answers[question.id] === question.correctOptionId ? 1 : 0,
        averageTime: timePerQuestion[question.id],
        timesTaken: [timePerQuestion[question.id]],
        answerChanges: behavioralData.answerChanges[question.id] || 0,
        confidenceLevel: confidenceScore,
        difficulty: question.difficulty || 1,
        tags: question.tags || [],
        masteryProgress: answers[question.id] === question.correctOptionId ? 0.1 : 0
      });
    }

    // Update session metrics
    await this.updateSessionMetrics({
      sessionId: Date.now().toString(),
      startTime: data.startTime,
      endTime: data.endTime,
      focusTime: data.endTime - data.startTime,
      breaks: 0, // To be implemented
      completionRate: questions.length / questions.length, // To be enhanced
      engagementScore: 0, // To be implemented
      learningEfficiency: 0, // To be implemented
      ...sessionMetrics
    });

    // Additional analytics processing can be added here
  }

  public async getDetailedAnalytics(userId: string): Promise<{
    enhancedStats: EnhancedQuizAnalytics;
    learningPattern: LearningPattern;
    questionStats: Record<string, QuestionAnalytics>;
  }> {
    // Implement comprehensive analytics retrieval
    return {
      enhancedStats: await this.getEnhancedStats(ANALYTICS_KEYS.OVERALL_STATS),
      learningPattern: this.analyzeLearningPattern([]),
      questionStats: {}
    };
  }

  public async processQuizResults(data: {
    questions: Question[];
    answers: Record<string, string>;
    timePerQuestion: Record<string, number>;
    totalTime: number;
    subjectId?: string;
    topicId?: string;
  }): Promise<void> {
    const { questions, answers, timePerQuestion, totalTime, subjectId, topicId } = data;
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(timePerQuestion, answers, questions);
    
    // Get current stats
    const statsKey = topicId
      ? ANALYTICS_KEYS.TOPIC_STATS + topicId
      : subjectId
      ? ANALYTICS_KEYS.SUBJECT_STATS + subjectId
      : ANALYTICS_KEYS.OVERALL_STATS;
    
    const currentStats = await this.getEnhancedStats(statsKey);
    
    // Update stats with new quiz data
    const correctAnswers = questions.filter(q => answers[q.id] === q.correctOptionId).length;
    const accuracy = (correctAnswers / questions.length) * 100;
    
    const updatedStats: EnhancedQuizAnalytics = {
      ...currentStats,
      correct: currentStats.correct + correctAnswers,
      total: currentStats.total + questions.length,
      accuracy: accuracy,
      confidenceScore: confidenceScore,
      engagementScore: Math.min(100, currentStats.engagementScore + 5),
      timeDistribution: {
        reading: Math.round(totalTime * 0.3),
        thinking: Math.round(totalTime * 0.5),
        answering: Math.round(totalTime * 0.2)
      },
      behavioralMetrics: {
        ...currentStats.behavioralMetrics,
        skips: questions.filter(q => !answers[q.id]).length
      }
    };
    
    // Calculate and update mastery level
    updatedStats.masteryLevel = this.calculateMasteryLevel(updatedStats);
    
    // Save updated stats
    await AsyncStorage.setItem(statsKey, JSON.stringify(updatedStats));
    
    // Update individual question stats
    for (const question of questions) {
      await this.updateQuestionStats(question.id, {
        attempts: 1,
        correctAttempts: answers[question.id] === question.correctOptionId ? 1 : 0,
        averageTime: timePerQuestion[question.id],
        timesTaken: [timePerQuestion[question.id]],
        difficulty: question.difficulty || 1
      });
    }
  }
}

export const enhancedAnalyticsEngine = EnhancedAnalyticsEngine.getInstance();
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types/quiz';
import { EnhancedAnalyticsEngine } from './enhancedAnalyticsService';

interface QuizResultAnalytics {
  subjectId: string;
  topicId?: string;
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
}

class QuizAnalyticsService {
  private static instance: QuizAnalyticsService;
  private analyticsEngine: EnhancedAnalyticsEngine;

  private constructor() {
    this.analyticsEngine = EnhancedAnalyticsEngine.getInstance();
  }

  public static getInstance(): QuizAnalyticsService {
    if (!QuizAnalyticsService.instance) {
      QuizAnalyticsService.instance = new QuizAnalyticsService();
    }
    return QuizAnalyticsService.instance;
  }

  private calculateAccuracy(correct: number, total: number): number {
    return total > 0 ? (correct / total) * 100 : 0;
  }

  private calculateDifficultyScore(questions: Question[], timePerQuestion: Record<string, number>): number {
    const scores = questions.map(question => {
      const baseScore = question.difficulty || 1;
      const time = timePerQuestion[question.id] || 0;
      const timeWeight = time > 30 ? 1.2 : time < 10 ? 0.8 : 1;
      return baseScore * timeWeight;
    });
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  public async saveQuizAnalytics(params: {
    questions: NonNullable<Question[]>;
    answers: Record<string, string>;
    timePerQuestion: Record<string, number>;
    totalTime: number;
    subjectId: string;
    topicId?: string;
  }): Promise<void> {
    const { questions, answers, timePerQuestion, totalTime, subjectId, topicId } = params;
    
    const correctAnswers = questions.filter(q => answers[q.id] === q.correctOptionId).length;
    const skippedAnswers = questions.filter(q => !answers[q.id]).length;
    const incorrectAnswers = questions.length - correctAnswers - skippedAnswers;

    const analytics: QuizResultAnalytics = {
      subjectId,
      topicId,
      accuracy: this.calculateAccuracy(correctAnswers, questions.length),
      timePerQuestion,
      totalTime,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers,
      difficultyScore: this.calculateDifficultyScore(questions, timePerQuestion),
      confidenceScore: 0, // Will be calculated by EnhancedAnalyticsEngine
      masteryLevel: 0, // Will be calculated by EnhancedAnalyticsEngine
      timestamp: Date.now()
    };

    try {
      // Save to local storage
      const key = `@quiz_analytics_${subjectId}_${topicId || 'all'}`;
      const existingData = await AsyncStorage.getItem(key);
      const quizHistory = existingData ? JSON.parse(existingData) : [];
      quizHistory.push(analytics);
      await AsyncStorage.setItem(key, JSON.stringify(quizHistory));

      // Update enhanced analytics
      await this.analyticsEngine.processQuizResults({
        questions,
        answers,
        timePerQuestion,
        totalTime,
        subjectId,
        topicId
      });
    } catch (error) {
      console.error('Error saving quiz analytics:', error);
    }
  }

  public async getQuizHistory(subjectId: string, topicId?: string): Promise<QuizResultAnalytics[]> {
    try {
      const key = `@quiz_analytics_${subjectId}_${topicId || 'all'}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving quiz history:', error);
      return [];
    }
  }
}

export const quizAnalyticsService = QuizAnalyticsService.getInstance();
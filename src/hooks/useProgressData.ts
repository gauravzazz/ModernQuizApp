import { useState, useEffect, useCallback } from 'react';
import {
  getQuizHistory,
  getAllSubjectAnalytics,
  getAllTopicAnalytics,
  getQuizAnalytics,
  SubjectAnalytics,
  TopicAnalytics,
  ProcessedQuizResult
} from '../services/quizResultService';
import { TimeRange } from '../molecules/TimeRangeSelector';

/**
 * Custom hook for fetching and managing progress data
 * Provides real-time updates when quiz data changes
 */
export const useProgressData = (initialTimeRange: TimeRange = 'week') => {
  // State for time range filtering
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  
  // State for analytics data
  const [quizHistory, setQuizHistory] = useState<ProcessedQuizResult[]>([]);
  const [subjects, setSubjects] = useState<SubjectAnalytics[]>([]);
  const [topics, setTopics] = useState<TopicAnalytics[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [timeData, setTimeData] = useState<Array<{ date: string; score: number }>>([]);
  const [difficultyData, setDifficultyData] = useState({ easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter data based on selected time range
  const filterDataByTimeRange = useCallback((data: any[], dateField: string = 'lastAttempted') => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    if (timeRange === 'week') {
      return data.filter(item => new Date(item[dateField]) >= weekAgo);
    } else if (timeRange === 'month') {
      return data.filter(item => new Date(item[dateField]) >= monthAgo);
    }
    
    return data;
  }, [timeRange]);
  
  // Prepare time performance data
  const prepareTimePerformanceData = useCallback((history: ProcessedQuizResult[]) => {
    // Group quizzes by date and calculate average score for each date
    const dateMap = new Map<string, { totalScore: number; count: number }>();
    
    history.forEach(quiz => {
      const date = new Date(quiz.timestamp).toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { totalScore: 0, count: 0 });
      }
      const dateData = dateMap.get(date)!;
      dateData.totalScore += quiz.scorePercentage;
      dateData.count += 1;
    });
    
    // Convert map to array and sort by date
    const result = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      score: Math.round(data.totalScore / data.count)
    }));
    
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, []);
  
  // Prepare difficulty distribution data
  const prepareDifficultyData = useCallback((history: ProcessedQuizResult[]) => {
    // Count questions by difficulty based on score
    let easy = 0;
    let medium = 0;
    let hard = 0;
    
    history.forEach(quiz => {
      if (quiz.scorePercentage >= 80) {
        easy += 1;
      } else if (quiz.scorePercentage >= 50) {
        medium += 1;
      } else {
        hard += 1;
      }
    });
    
    return { easy, medium, hard };
  }, []);
  
  // Function to fetch all progress data
  const fetchProgressData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch quiz history
      const history = await getQuizHistory();
      const filteredHistory = filterDataByTimeRange(history, 'timestamp');
      setQuizHistory(filteredHistory);
      
      // Fetch subject analytics
      const allSubjects = await getAllSubjectAnalytics();
      const filteredSubjects = filterDataByTimeRange(allSubjects);
      setSubjects(filteredSubjects);
      
      // Fetch topic analytics
      const allTopics = await getAllTopicAnalytics();
      const filteredTopics = filterDataByTimeRange(allTopics);
      setTopics(filteredTopics);
      
      // Fetch overall quiz analytics
      const analytics = await getQuizAnalytics();
      setTotalQuizzes(filteredHistory.length);
      
      // Calculate accuracy
      if (filteredHistory.length > 0) {
        const totalCorrect = filteredHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
        const totalQuestions = filteredHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
        const calculatedAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        setAccuracy(calculatedAccuracy);
        
        // Calculate average score
        const totalScore = filteredHistory.reduce((sum, quiz) => sum + quiz.scorePercentage, 0);
        const calculatedAvgScore = Math.round(totalScore / filteredHistory.length);
        setAverageScore(calculatedAvgScore);
      }
      
      // Get streak from analytics
      setStreak(analytics.streak || 0);
      
      // Prepare time performance data
      const timePerformanceData = prepareTimePerformanceData(filteredHistory);
      setTimeData(timePerformanceData);
      
      // Prepare difficulty distribution data
      const difficultyDistribution = prepareDifficultyData(filteredHistory);
      setDifficultyData(difficultyDistribution);
    } catch (err) {
      console.error('Error loading progress data:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  }, [filterDataByTimeRange, prepareTimePerformanceData, prepareDifficultyData]);
  
  // Initial data fetch
  useEffect(() => {
    fetchProgressData();
  }, [timeRange, fetchProgressData]);
  
  // Function to refresh progress data
  const refreshProgress = useCallback(() => {
    fetchProgressData();
  }, [fetchProgressData]);
  
  // Function to change time range
  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);
  
  return {
    timeRange,
    quizHistory,
    subjects,
    topics,
    totalQuizzes,
    accuracy,
    streak,
    averageScore,
    timeData,
    difficultyData,
    loading,
    error,
    handleTimeRangeChange,
    refreshProgress
  };
};
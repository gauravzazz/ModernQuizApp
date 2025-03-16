export interface QuizAttempt {
  id: string;
  subjectId: string;
  topicId?: string;
  mode: 'Practice' | 'Test';
  correctAnswers: number;
  totalQuestions: number;
  timePerQuestion: Record<string, number>;
  timestamp: number;
  processed: boolean;
}

export interface QuizHistory {
  id: string;
  quiz: string;
  subject: string;
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: string;
  date: number;
  timestamp: number;
  scorePercentage: number;
  subjectId?: string;
  topicId?: string;
  duration?: number;
  questionIds: string[];
  mode: 'Practice' | 'Test';
  attempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string;
    timeSpent: number;
    isSkipped: boolean;
  }>;
  questionsData?: Array<{
    id: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    correctOptionId: string;
  }>;
}
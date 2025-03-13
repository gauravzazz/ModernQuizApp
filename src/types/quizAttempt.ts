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
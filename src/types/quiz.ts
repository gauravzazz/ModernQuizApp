export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
  difficulty?: number;
  tags?: string[];
  exam?: string;
}

export interface QuizHistory {
  id: string;
  timestamp: number;
  scorePercentage: number;
  correctAnswers: number;
  totalQuestions: number;
  subjectId?: string;
  topicId?: string;
  duration?: number;
  questionIds: string[];
}
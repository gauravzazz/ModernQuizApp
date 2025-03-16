import { Question } from '../types/quiz';

// Mock questions data
export const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the square root of 144?',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '12' },
      { id: 'c', text: '14' },
      { id: 'd', text: '16' },
    ],
    correctOptionId: 'b',
    explanation: 'The square root of 144 is 12 because 12 × 12 = 144. To find a square root, we look for a number that, when multiplied by itself, gives us the original number. In this case, 12 is that number.',
  },
  {
    id: '2',
    text: 'What is 25% of 80?',
    options: [
      { id: 'a', text: '15' },
      { id: 'b', text: '20' },
      { id: 'c', text: '25' },
      { id: 'd', text: '30' },
    ],
    correctOptionId: 'b',
    explanation: 'To find 25% of 80, we can either multiply 80 by 0.25 or divide 80 by 4 (since 25% is one-fourth). Using either method: 80 × 0.25 = 20 or 80 ÷ 4 = 20.',
  },
  {
    id: '3',
    text: 'If x + 5 = 12, what is x?',
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '6' },
      { id: 'c', text: '7' },
      { id: 'd', text: '8' },
    ],
    correctOptionId: 'c',
    explanation: 'To solve for x, we subtract 5 from both sides of the equation to isolate x. So, x + 5 = 12 becomes x = 12 - 5 = 7. We can verify this by plugging 7 back into the original equation: 7 + 5 = 12 ✓',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchQuestions = async (
  topicId: string | undefined,
  count: number
): Promise<Question[]> => {
  try {
    // Simulate API call delay
    await delay(1000);

    // In the future, this would be replaced with a real API call
    // const response = await api.get(`/questions?topicId=${topicId}&count=${count}`);
    // return response.data;

    // For now, return mock data
    return mockQuestions.slice(0, count);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }
};

/**
 * Fetch questions by their IDs
 * This is used when viewing quiz results from history
 */
export const fetchQuestionsByIds = async (questionIds: string[]): Promise<Question[]> => {
  try {
    // Simulate API call delay
    await delay(500);

    // In the future, this would be replaced with a real API call
    // const response = await api.get(`/questions/batch?ids=${questionIds.join(',')}`);
    // return response.data;

    // For now, filter mock data by the provided IDs
    return mockQuestions.filter(question => questionIds.includes(question.id));
  } catch (error) {
    console.error('Error fetching questions by IDs:', error);
    throw new Error('Failed to fetch questions by IDs');
  }
};
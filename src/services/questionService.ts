import { Question } from '../types/quiz';

// Mock questions data
const mockQuestions: Question[] = [
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
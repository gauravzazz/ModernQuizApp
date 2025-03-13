import { mockSubjects, mockTopics, mockMathTopics } from '../data/mockData';
import { Subject, Topic } from '../data/mockData';

export const getSubjectById = (subjectId: string): Subject | undefined => {
  return mockSubjects.find(subject => subject.id === subjectId);
};

export const getTopicById = (topicId: string): Topic | undefined => {
  // Search in both topic collections
  return [...mockTopics, ...mockMathTopics].find(topic => topic.id === topicId);
};

export const getSubjectByTopicId = (topicId: string): Subject | undefined => {
  // For this mock implementation, we'll assume topics with IDs 1-8 belong to Mathematics (id: '2')
  // and the rest belong to Computer Science (id: '8')
  const topic = getTopicById(topicId);
  if (!topic) return undefined;
  
  if (mockMathTopics.some(t => t.id === topicId)) {
    return mockSubjects.find(subject => subject.id === '2'); // Mathematics
  } else {
    return mockSubjects.find(subject => subject.id === '8'); // Computer Science
  }
};
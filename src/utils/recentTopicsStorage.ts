import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockMathTopics } from '../data/mockData';

const RECENT_TOPICS_KEY_PREFIX = '@recent_topics_';
const MAX_RECENT_TOPICS = 5;

export const addRecentTopic = async (subjectId: string, topicId: string) => {
  try {
    const storageKey = `${RECENT_TOPICS_KEY_PREFIX}${subjectId}`;
    console.log('[addRecentTopic] Adding topic:', { subjectId, topicId, storageKey });
    
    const recentTopics = await getRecentTopics(subjectId);
    console.log('[addRecentTopic] Current recent topics:', recentTopics);
    
    // Remove the topic if it already exists
    const updatedTopics = recentTopics.filter(id => id !== topicId);
    
    // Add the new topic at the beginning
    updatedTopics.unshift(topicId);
    
    // Keep only the most recent topics
    const limitedTopics = updatedTopics.slice(0, MAX_RECENT_TOPICS);
    console.log('[addRecentTopic] Updated topics to save:', limitedTopics);
    
    await AsyncStorage.setItem(storageKey, JSON.stringify(limitedTopics));
    console.log('[addRecentTopic] Successfully saved to AsyncStorage');
  } catch (error) {
    console.error('[addRecentTopic] Error adding recent topic:', error);
    throw error; // Re-throw to handle in the component
  }
};

export const getRecentTopics = async (subjectId: string): Promise<string[]> => {
  try {
    const storageKey = `${RECENT_TOPICS_KEY_PREFIX}${subjectId}`;
    console.log('[getRecentTopics] Fetching topics for key:', storageKey);
    
    const topics = await AsyncStorage.getItem(storageKey);
    const parsedTopics = topics ? JSON.parse(topics) : [];
    console.log('[getRecentTopics] Retrieved topics:', parsedTopics);
    
    return parsedTopics;
  } catch (error) {
    console.error('[getRecentTopics] Error getting recent topics:', error);
    return [];
  }
};

export const fetchRecentTopics = async (subjectId: string) => {
  try {
    console.log('[fetchRecentTopics] Fetching topics for subject:', subjectId);
    
    const recentTopicIds = await getRecentTopics(subjectId);
    console.log('[fetchRecentTopics] Retrieved topic IDs:', recentTopicIds);
    
    const recentTopicsData = recentTopicIds
      .map(id => mockMathTopics.find(topic => topic.id === id))
      .filter(topic => topic !== undefined);
    
    console.log('[fetchRecentTopics] Mapped to topic data:', recentTopicsData);
    return recentTopicsData;
  } catch (error) {
    console.error('[fetchRecentTopics] Error fetching recent topics:', error);
    return [];
  }
};
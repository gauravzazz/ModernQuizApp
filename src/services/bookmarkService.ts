import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types/quiz';
import { fetchQuestions } from './questionService';

const BOOKMARKS_KEY = '@quiz_bookmarks';

// Get all bookmarked question IDs
export const getBookmarkedQuestionIds = async (): Promise<string[]> => {
  try {
    const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error getting bookmarked questions:', error);
    return [];
  }
};

// Add a question to bookmarks
export const addBookmark = async (questionId: string): Promise<void> => {
  try {
    const bookmarks = await getBookmarkedQuestionIds();
    if (!bookmarks.includes(questionId)) {
      bookmarks.push(questionId);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new Error('Failed to add bookmark');
  }
};

// Remove a question from bookmarks
export const removeBookmark = async (questionId: string): Promise<void> => {
  try {
    const bookmarks = await getBookmarkedQuestionIds();
    const updatedBookmarks = bookmarks.filter(id => id !== questionId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw new Error('Failed to remove bookmark');
  }
};

// Check if a question is bookmarked
export const isQuestionBookmarked = async (questionId: string): Promise<boolean> => {
  try {
    const bookmarks = await getBookmarkedQuestionIds();
    return bookmarks.includes(questionId);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

// Get all bookmarked questions with full data
export const getBookmarkedQuestions = async (): Promise<Question[]> => {
  try {
    const bookmarkedIds = await getBookmarkedQuestionIds();
    if (bookmarkedIds.length === 0) return [];

    // For now, we'll filter from mock questions
    // In the future, this would make an API call with the IDs
    const allQuestions = await fetchQuestions(undefined, 100); // Fetch all available questions
    return allQuestions.filter(question => bookmarkedIds.includes(question.id));
  } catch (error) {
    console.error('Error fetching bookmarked questions:', error);
    return [];
  }
};
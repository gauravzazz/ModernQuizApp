import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockSubjects } from '../data/mockData';

const RECENT_SUBJECTS_KEY = '@recent_subjects';
const MAX_RECENT_SUBJECTS = 5;

export const addRecentSubject = async (subjectId: string) => {
  console.log(`[RecentSubjects] Adding subject with ID: ${subjectId}`);
  try {
    const recentSubjects = await getRecentSubjects();
    console.log(`[RecentSubjects] Current subjects in storage: ${JSON.stringify(recentSubjects)}`);
    
    // Remove the subject if it already exists
    const updatedSubjects = recentSubjects.filter(id => id !== subjectId);
    
    // Add the new subject at the beginning
    updatedSubjects.unshift(subjectId);
    
    // Keep only the most recent subjects
    const limitedSubjects = updatedSubjects.slice(0, MAX_RECENT_SUBJECTS);
    console.log(`[RecentSubjects] Updated subjects list: ${JSON.stringify(limitedSubjects)}`);
    
    await AsyncStorage.setItem(RECENT_SUBJECTS_KEY, JSON.stringify(limitedSubjects));
    console.log('[RecentSubjects] Successfully saved updated subjects list');
  } catch (error) {
    console.error('[RecentSubjects] Error adding recent subject:', error);
  }
};

export const getRecentSubjects = async (): Promise<string[]> => {
  console.log('[RecentSubjects] Fetching recent subjects from storage');
  try {
    const subjects = await AsyncStorage.getItem(RECENT_SUBJECTS_KEY);
    const parsedSubjects = subjects ? JSON.parse(subjects) : [];
    console.log(`[RecentSubjects] Retrieved ${parsedSubjects.length} subjects from storage`);
    return parsedSubjects;
  } catch (error) {
    console.error('[RecentSubjects] Error getting recent subjects:', error);
    return [];
  }
};

export const fetchRecentSubjects = async () => {
  console.log('[RecentSubjects] Starting to fetch recent subjects data');
  try {
    const recentSubjectIds = await getRecentSubjects();
    console.log(`[RecentSubjects] Mapping ${recentSubjectIds.length} subject IDs to full data`);
    
    const recentSubjectsData = recentSubjectIds
      .map(id => mockSubjects.find(subject => subject.id === id))
      .filter(subject => subject !== undefined);
    
    console.log(`[RecentSubjects] Successfully retrieved ${recentSubjectsData.length} subjects with full data`);
    return recentSubjectsData;
  } catch (error) {
    console.error('[RecentSubjects] Error fetching recent subjects:', error);
    return [];
  }
};
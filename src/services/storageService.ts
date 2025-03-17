import AsyncStorage from '@react-native-async-storage/async-storage';

// Define storage key categories for better organization
export enum StorageCategory {
  PROFILE = 'Profile',
  QUIZ_HISTORY = 'Quiz History',
  QUIZ_ANALYTICS = 'Quiz Analytics',
  BOOKMARKS = 'Bookmarks',
  RECENT_ITEMS = 'Recent Items',
  THEME = 'Theme',
  ONBOARDING = 'Onboarding',
  IMAGE_CACHE = 'Image Cache',
  OTHER = 'Other'
}

// Interface for storage key metadata
export interface StorageKeyInfo {
  key: string;
  description: string;
  category: StorageCategory;
}

// Known storage keys in the app
const KNOWN_STORAGE_KEYS: StorageKeyInfo[] = [
  { key: '@user_profile', description: 'User profile data', category: StorageCategory.PROFILE },
  { key: '@quiz_history', description: 'Quiz attempt history', category: StorageCategory.QUIZ_HISTORY },
  { key: '@quiz_analytics', description: 'Overall quiz analytics', category: StorageCategory.QUIZ_ANALYTICS },
  { key: '@subject_analytics_', description: 'Subject-specific analytics', category: StorageCategory.QUIZ_ANALYTICS },
  { key: '@topic_analytics_', description: 'Topic-specific analytics', category: StorageCategory.QUIZ_ANALYTICS },
  { key: '@question_analytics_', description: 'Question-specific analytics', category: StorageCategory.QUIZ_ANALYTICS },
  { key: '@quiz_bookmarks', description: 'Bookmarked questions', category: StorageCategory.BOOKMARKS },
  { key: '@recent_subjects', description: 'Recently viewed subjects', category: StorageCategory.RECENT_ITEMS },
  { key: '@recent_topics_', description: 'Recently viewed topics', category: StorageCategory.RECENT_ITEMS },
  { key: '@theme_preference', description: 'Theme preference (light/dark)', category: StorageCategory.THEME },
  { key: '@onboarding_completed', description: 'Onboarding completion status', category: StorageCategory.ONBOARDING },
  { key: '@image_cache_index', description: 'Cached images index', category: StorageCategory.IMAGE_CACHE },
];

/**
 * Get all AsyncStorage keys
 */
export const getAllStorageKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all storage keys:', error);
    return [];
  }
};

/**
 * Get all storage keys grouped by category
 */
export const getCategorizedStorageKeys = async (): Promise<Record<StorageCategory, StorageKeyInfo[]>> => {
  try {
    const allKeys = await getAllStorageKeys();
    const result: Record<StorageCategory, StorageKeyInfo[]> = Object.values(StorageCategory).reduce(
      (acc, category) => ({ ...acc, [category]: [] }), 
      {} as Record<StorageCategory, StorageKeyInfo[]>
    );

    // Categorize known keys
    allKeys.forEach(key => {
      // Find matching known key info (exact match or prefix match)
      const keyInfo = KNOWN_STORAGE_KEYS.find(info => 
        key === info.key || (info.key.endsWith('_') && key.startsWith(info.key))
      );

      if (keyInfo) {
        // For prefix matches, create a new key info with the full key
        if (key !== keyInfo.key && keyInfo.key.endsWith('_')) {
          result[keyInfo.category].push({
            key,
            description: keyInfo.description,
            category: keyInfo.category
          });
        } else {
          result[keyInfo.category].push(keyInfo);
        }
      } else {
        // Unknown keys go to OTHER category
        result[StorageCategory.OTHER].push({
          key,
          description: 'Unknown storage item',
          category: StorageCategory.OTHER
        });
      }
    });

    return result;
  } catch (error) {
    console.error('Error categorizing storage keys:', error);
    return Object.values(StorageCategory).reduce(
      (acc, category) => ({ ...acc, [category]: [] }), 
      {} as Record<StorageCategory, StorageKeyInfo[]>
    );
  }
};

/**
 * Clear all AsyncStorage data except for specified keys
 * @param exceptKeys Array of keys to preserve
 */
export const clearStorageWithExceptions = async (exceptKeys: string[] = []): Promise<void> => {
  try {
    // Get all keys
    const allKeys = await AsyncStorage.getAllKeys();
    
    // Filter out the keys to keep
    const keysToRemove = allKeys.filter(key => !exceptKeys.includes(key));
    
    if (keysToRemove.length > 0) {
      // Remove the filtered keys
      await AsyncStorage.multiRemove(keysToRemove);
      console.log(`Cleared ${keysToRemove.length} storage items`);
    } else {
      console.log('No storage items to clear');
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear storage data');
  }
};

/**
 * Clear all AsyncStorage data
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('All storage data cleared');
  } catch (error) {
    console.error('Error clearing all storage:', error);
    throw new Error('Failed to clear all storage data');
  }
};
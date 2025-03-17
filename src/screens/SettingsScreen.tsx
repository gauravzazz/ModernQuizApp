import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Toggle } from '../atoms/Toggle';
import { Button } from '../atoms/Button';
import { NavigationButton } from '../atoms/NavigationButton';
import { useThemeContext } from '../context/ThemeContext';
import { StorageClearModal } from '../atoms/StorageClearModal';
import { StorageCategory, clearStorageWithExceptions, getCategorizedStorageKeys } from '../services/storageService';

interface SettingsSection {
  title: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'button';
  value?: boolean;
  onPress?: () => void;
}

export const SettingsScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const navigation = useNavigation();
  const mockSettings: SettingsSection[] = [
    {
      title: 'Appearance',
      settings: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          description: 'Enable dark mode for better viewing in low light',
          type: 'toggle',
          value: true,
        },
        {
          id: 'animations',
          title: 'Enable Animations',
          description: 'Show smooth transitions and animations',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      title: 'Notifications',
      settings: [
        {
          id: 'quizReminders',
          title: 'Quiz Reminders',
          description: 'Get notified about pending quizzes',
          type: 'toggle',
          value: true,
        },
        {
          id: 'progressUpdates',
          title: 'Progress Updates',
          description: 'Receive weekly progress summaries',
          type: 'toggle',
          value: false,
        },
      ],
    },
    {
      title: 'Account',
      settings: [
        {
          id: 'syncData',
          title: 'Sync Data',
          description: 'Last synced: 2 hours ago',
          type: 'button',
        },
        {
          id: 'clearData',
          title: 'Clear App Data',
          description: 'Remove all saved data with option to preserve selected items',
          type: 'button',
        },
      ],
    },
  ];
  // State declarations
  const [storageClearModalVisible, setStorageClearModalVisible] = useState(false);
  const [settings, setSettings] = useState(mockSettings);

  // Handle storage clearing with exceptions
  const handleClearStorage = async (exceptCategories: StorageCategory[]) => {
  try {
    // Get all storage keys categorized
    const categorizedKeys = await getCategorizedStorageKeys();
    
    // Get all keys to preserve based on selected categories
    const keysToPreserve: string[] = [];
    
    // Add keys from selected categories to preserve list
    exceptCategories.forEach(category => {
      const categoryKeys = categorizedKeys[category] || [];
      categoryKeys.forEach(keyInfo => {
        keysToPreserve.push(keyInfo.key);
      });
    });
    
    console.log('Preserving categories:', exceptCategories);
    console.log('Preserving keys:', keysToPreserve);
    
    // Clear storage with exceptions
    await clearStorageWithExceptions(keysToPreserve);
    
    // Show success message
    Alert.alert(
      'Storage Cleared',
      'App storage has been cleared successfully while preserving selected data.',
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('Error clearing storage:', error);
    Alert.alert(
      'Error',
      'Failed to clear storage. Please try again.',
      [{ text: 'OK' }]
    );
  }
};



  // Create styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      marginBottom: 16,
    },
    settingCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    settingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
  });

  const handleToggle = (settingId: string, value: boolean) => {
    console.log(`Toggle ${settingId}:`, value);
    
    // If the dark mode setting is toggled, use the theme context
    if (settingId === 'darkMode') {
      toggleTheme();
    }
    
    // Update the local settings state
    setSettings(prevSettings => {
      return prevSettings.map(section => ({
        ...section,
        settings: section.settings.map(setting => 
          setting.id === settingId ? { ...setting, value } : setting
        )
      }));
    });
  };

  const handleButtonPress = (settingId: string) => {
    console.log(`Button pressed: ${settingId}`);
    
    if (settingId === 'clearData') {
      setStorageClearModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavigationButton 
          variant="left" 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="h4" weight="bold">
          Settings
        </Typography>
      </View>

      <ScrollView>
        {settings.map((section) => (
          <View key={section.title} style={styles.section}>
            <Typography
              variant="h6"
              weight="bold"
              style={styles.sectionTitle}
            >
              {section.title}
            </Typography>

            {section.settings.map((setting) => (
              <View key={setting.id} style={styles.settingCard}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingInfo}>
                    <Typography variant="body1" weight="medium">
                      {setting.title}
                    </Typography>
                    {setting.description && (
                      <Typography
                        variant="caption"
                        color="onSurfaceVariant"
                      >
                        {setting.description}
                      </Typography>
                    )}
                  </View>

                  {setting.type === 'toggle' ? (
                    <Toggle
                      value={setting.id === 'darkMode' ? isDarkMode : setting.value || false}
                      onValueChange={(value) => handleToggle(setting.id, value)}
                    />
                  ) : (
                    <Button
                      label={setting.title}
                      size="small"
                      onPress={() => handleButtonPress(setting.id)}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      
      {/* Storage Clear Modal */}
      <StorageClearModal
        visible={storageClearModalVisible}
        onClose={() => setStorageClearModalVisible(false)}
        onClearStorage={handleClearStorage}
      />
    </View>
  );
};
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { Button } from './Button';
import { Toggle } from './Toggle';
import { StorageCategory, StorageKeyInfo, getCategorizedStorageKeys } from '../services/storageService';

interface StorageClearModalProps {
  visible: boolean;
  onClose: () => void;
  onClearStorage: (exceptCategories: StorageCategory[]) => Promise<void>;
}

export const StorageClearModal: React.FC<StorageClearModalProps> = ({
  visible,
  onClose,
  onClearStorage,
}) => {
  const theme = useTheme<AppTheme>();
  const [loading, setLoading] = useState(false);
  const [storageData, setStorageData] = useState<Record<StorageCategory, StorageKeyInfo[]>>({} as Record<StorageCategory, StorageKeyInfo[]>);
  const [exceptCategories, setExceptCategories] = useState<StorageCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load storage data when modal becomes visible
  useEffect(() => {
    if (visible) {
      loadStorageData();
    }
  }, [visible]);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategorizedStorageKeys();
      setStorageData(data);
      
      // Default to preserving profile and theme data
      setExceptCategories([StorageCategory.PROFILE, StorageCategory.THEME]);
    } catch (error) {
      console.error('Error loading storage data:', error);
      setError('Failed to load storage data');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: StorageCategory) => {
    setExceptCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleClearStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      await onClearStorage(exceptCategories);
      onClose();
    } catch (error) {
      console.error('Error clearing storage:', error);
      setError('Failed to clear storage data');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      zIndex: 1,
    },
    blurOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: -1,
    },
    fallbackOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: -1,
    },
    modalContent: {
      width: '100%',
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness * 2,
      padding: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      maxHeight: '80%',
    },
    modalHeader: {
      marginBottom: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    scrollContent: {
      marginBottom: 24,
    },
    categorySection: {
      marginBottom: 16,
    },
    categoryHeader: {
      marginBottom: 8,
    },
    categoryItem: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 16,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    categoryInfo: {
      flex: 1,
      marginRight: 16,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 16,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    button: {
      flex: 1,
      marginHorizontal: 4,
    },
    warningText: {
      color: theme.colors.error,
      marginBottom: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    itemCount: {
      marginLeft: 8,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    itemCountText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Blur background on iOS, semi-transparent overlay on Android */}
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} style={styles.blurOverlay} tint="dark" />
        ) : (
          <View style={styles.fallbackOverlay} />
        )}

        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Typography variant="h6" weight="bold">
              Clear App Storage
            </Typography>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={18} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <Typography variant="body1" style={{ marginBottom: 16 }}>
            Select data categories you want to preserve when clearing app storage.
          </Typography>

          <Typography style={styles.warningText}>
            Warning: Unselected data will be permanently deleted!
          </Typography>

          {error && <Typography style={styles.errorText}>{error}</Typography>}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Typography style={{ marginTop: 16 }}>Loading storage data...</Typography>
            </View>
          ) : (
            <ScrollView style={styles.scrollContent}>
              {Object.entries(storageData).map(([category, items]) => {
                // Skip empty categories
                if (items.length === 0) return null;
                
                const categoryEnum = category as StorageCategory;
                return (
                  <View key={category} style={styles.categorySection}>
                    <Typography variant="h2" weight="bold" style={styles.categoryHeader}>
                      {category}
                    </Typography>
                    
                    <View style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <Typography variant="body1">
                          Preserve {category} Data
                        </Typography>
                        <Typography variant="caption" color="onSurfaceVariant">
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </Typography>
                      </View>
                      <Toggle
                        value={exceptCategories.includes(categoryEnum)}
                        onValueChange={() => toggleCategory(categoryEnum)}
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            <Button
              label="Cancel"
              onPress={onClose}
              variant="secondary"
              style={styles.button}
            />
            <Button
              label="Clear Data"
              onPress={handleClearStorage}
              style={styles.button}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FilterType = 'all' | 'correct' | 'incorrect' | 'skipped';

interface QuizResultFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const QuizResultFilters: React.FC<QuizResultFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 4,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 4,
      alignItems: 'center',
      borderRadius: theme.roundness - 4,
      justifyContent: 'center',
    },
    activeFilterButton: {
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'all' && styles.activeFilterButton,
        ]}
        onPress={() => onFilterChange('all')}
      >
        <MaterialCommunityIcons 
          name="filter-variant" 
          size={24} 
          color={activeFilter === 'all' ? theme.colors.onPrimary : theme.colors.onSurface} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'correct' && styles.activeFilterButton,
        ]}
        onPress={() => onFilterChange('correct')}
      >
        <MaterialCommunityIcons 
          name="check-circle" 
          size={24} 
          color={activeFilter === 'correct' ? theme.colors.onPrimary : theme.colors.success} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'incorrect' && styles.activeFilterButton,
        ]}
        onPress={() => onFilterChange('incorrect')}
      >
        <MaterialCommunityIcons 
          name="close-circle" 
          size={24} 
          color={activeFilter === 'incorrect' ? theme.colors.onPrimary : theme.colors.error} 
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'skipped' && styles.activeFilterButton,
        ]}
        onPress={() => onFilterChange('skipped')}
      >
        <MaterialCommunityIcons 
          name="skip-next-circle" 
          size={24} 
          color={activeFilter === 'skipped' ? theme.colors.onPrimary : theme.colors.warning} 
        />
      </TouchableOpacity>
    </View>
  );
};
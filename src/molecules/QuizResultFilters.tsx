import React from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FilterType = 'all' | 'correct' | 'incorrect' | 'skipped';

interface QuizResultFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isSticky?: boolean;
  style?: any;
}

export const QuizResultFilters: React.FC<QuizResultFiltersProps> = ({
  activeFilter,
  onFilterChange,
  isSticky = false,
  style,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding:  4,
      shadowColor: theme.colors.neuDark,
      shadowOffset: isSticky ? { width: 0, height: 3 } : { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 8,
      borderWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.neuLight,
      borderBottomColor: theme.colors.neuLight,
      ...(isSticky && {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        alignSelf: 'center',
      }),
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
    <Animated.View style={[styles.filterContainer, style]}>
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
    </Animated.View>
  );
};
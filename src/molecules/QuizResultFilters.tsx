import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
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
      paddingVertical: 8,
      paddingHorizontal: 4,
      alignItems: 'center',
      borderRadius: theme.roundness - 4,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    activeFilterButton: {
      backgroundColor: theme.colors.primary,
    },
    filterIcon: {
      marginRight: 4,
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
          size={16} 
          color={activeFilter === 'all' ? theme.colors.onPrimary : theme.colors.onSurface} 
          style={styles.filterIcon}
        />
        <Typography
          variant="button"
          color={activeFilter === 'all' ? 'onPrimary' : 'onSurface'}
        >
          All
        </Typography>
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
          size={16} 
          color={activeFilter === 'correct' ? theme.colors.onPrimary : theme.colors.success} 
          style={styles.filterIcon}
        />
        <Typography
          variant="button"
          color={activeFilter === 'correct' ? 'onPrimary' : 'onSurface'}
        >
          Correct
        </Typography>
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
          size={16} 
          color={activeFilter === 'incorrect' ? theme.colors.onPrimary : theme.colors.error} 
          style={styles.filterIcon}
        />
        <Typography
          variant="button"
          color={activeFilter === 'incorrect' ? 'onPrimary' : 'onSurface'}
        >
          Incorrect
        </Typography>
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
          size={16} 
          color={activeFilter === 'skipped' ? theme.colors.onPrimary : theme.colors.warning} 
          style={styles.filterIcon}
        />
        <Typography
          variant="button"
          color={activeFilter === 'skipped' ? 'onPrimary' : 'onSurface'}
        >
          Skipped
        </Typography>
      </TouchableOpacity>
    </View>
  );
};
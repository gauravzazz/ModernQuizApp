import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface Subject {
  icon: string;
  description: string;
  topicsCount: number;
  questionsCount: number;
  progress: number;
}

interface SubjectDescriptionProps {
  subject: Subject;
  onSearchChange: (query: string) => void;
}

export const SubjectDescription: React.FC<SubjectDescriptionProps> = ({ subject, onSearchChange }) => {
  const theme = useTheme<AppTheme>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 24,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 24,
      textAlign: 'center',
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
    },
    searchContainer: {
      marginTop: 24,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.neuPrimary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      padding: 0,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={subject.icon as keyof typeof Ionicons.glyphMap} size={48} color={theme.colors.primary} />
      </View>
      
      <Text style={[styles.description, { color: theme.colors.onSurface }]}>
        {subject.description}
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {subject.topicsCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Topics
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {subject.questionsCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Questions
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {subject.progress}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
            Progress
          </Text>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Search topics..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>
    </View>
  );
};
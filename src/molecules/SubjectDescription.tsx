import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ImageBackground, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';

interface Subject {
  icon: string;
  iconType?: 'ionicons' | 'emoji';
  title: string;
  description: string;
  topicsCount: number;
  questionsCount: number;
  progress: number;
  accuracy?: number;
  backgroundImage?: string;
}

interface SubjectDescriptionProps {
  subject: Subject;
  onSearchChange: (query: string) => void;
  showSearchBar?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (text: string) => void;
  height?: number;
}

export const SubjectDescription: React.FC<SubjectDescriptionProps> = ({ 
  subject, 
  onSearchChange, 
  showSearchBar = true,
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  height
}) => {
  const theme = useTheme<AppTheme>();
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const screenHeight = Dimensions.get('window').height;
  
  // Use either external or internal search query state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  
  const handleSearchChange = (text: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(text);
    } else {
      setInternalSearchQuery(text);
    }
    onSearchChange(text);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      overflow: 'hidden',
      height: height || screenHeight * 0.40, // Reduced height to make search bar visible
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: 16, // Reduced padding to save space
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 10, // Reduced margin
    },
    iconBackground: {
      width: 70,
      height: 70,
      borderRadius: 35, // Reduced icon size
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 10, // Reduced margin
    },
    title: {
      textAlign: 'center',
      marginTop: 16,
      color: '#FFFFFF',
    },
    description: {
      textAlign: 'center',
      marginBottom: 12, // Reduced margin
      color: '#FFFFFF',
      opacity: 0.9,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12, // Reduced margin
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: theme.roundness,
      padding: 10, // Reduced padding
    },
    statItem: {
      alignItems: 'center',
    },
    searchContainer: {
      marginTop: 8, // Reduced margin
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: theme.roundness,
      padding: 6, // Reduced padding
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8, // Reduced padding
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      padding: 4,
      color: theme.colors.onSurface,
    },
  });

  // Render the search bar component separately so it can be used in both places
  const renderSearchBar = () => (
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
  );

  return (
    <View style={styles.card}>
      <ImageBackground 
        source={subject.backgroundImage ? { uri: subject.backgroundImage } : require('../../assets/default-subject-bg.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              {subject.iconType === 'ionicons' ? (
                <Ionicons name={subject.icon as keyof typeof Ionicons.glyphMap} size={48} color={theme.colors.primary} />
              ) : (
                <Typography variant="h1" color="primary">{subject.icon}</Typography>
              )}
            </View>
          </View>
          
          <View style={styles.titleContainer}>
            <Typography variant="h4" weight="bold" style={styles.title}>
              {subject.title || 'Classic and modern literary works'}
            </Typography>
          </View>
          
          <Typography variant="body1" style={styles.description}>
            {subject.description}
          </Typography>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Typography variant="h2" weight="bold" color="primary">
                {subject.topicsCount}
              </Typography>
              <Typography variant="body1">
                Topics
              </Typography>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h2" weight="bold" color="primary">
                {subject.questionsCount}
              </Typography>
              <Typography variant="body1" >
                Questions
              </Typography>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h2" weight="bold" color="primary">
                {subject.progress}%
              </Typography>
              <Typography variant="body1" >
                Progress
              </Typography>
            </View>

            {subject.accuracy !== undefined && (
              <View style={styles.statItem}>
                <Typography variant="h2" weight="bold" color="primary">
                  {subject.accuracy}%
                </Typography>
                <Typography variant="body1" >
                  Accuracy
                </Typography>
              </View>
            )}
          </View>
          
          {/* Only show search bar in the card if showSearchBar is true */}
          {showSearchBar && renderSearchBar()}
        </View>
      </ImageBackground>
    </View>
  );
};

// Export the search bar component for use in other components
export const SubjectSearchBar: React.FC<{
  searchQuery: string;
  onSearchChange: (text: string) => void;
  style?: any;
}> = ({ searchQuery, onSearchChange, style }) => {
  const theme = useTheme<AppTheme>();
  
  const styles = StyleSheet.create({
    searchContainer: {
      marginTop: 10,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: theme.roundness,
      padding: 8,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8, // Reduced padding
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      padding: 4,
      color: theme.colors.onSurface,
    },
  });
  
  return (
    <View style={[styles.searchContainer, style]}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.onSurface }]}
          placeholder="Search topics..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
};
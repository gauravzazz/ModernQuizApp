import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ImageBackground, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

interface Subject {
  icon?: string;
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

  const isSmallScreen = Dimensions.get('window').width < 360;
  const isMediumScreen = Dimensions.get('window').width >= 360 && Dimensions.get('window').width < 600;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      marginBottom: scaledSpacing(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.6,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      overflow: 'hidden',
      height: height || screenHeight * (isSmallScreen ? 0.35 : isMediumScreen ? 0.40 : 0.45),
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: scaledSpacing(isSmallScreen ? 12 : 16),
      justifyContent: 'space-between',
      height: '100%',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    description: {
      textAlign: 'center',
      marginBottom: scaledSpacing(16),
      color: '#FFFFFF',
      opacity: 0.9,
      fontSize: scaledFontSize(isSmallScreen ? 13 : 16),
      lineHeight: scaledFontSize(isSmallScreen ? 19 : 24),
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: scaledSpacing(isSmallScreen ? 8 : 12),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: scaledRadius(theme.roundness),
      padding: scaledSpacing(isSmallScreen ? 6 : isMediumScreen ? 8 : 10),
      flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
    },
    statItem: {
      alignItems: 'center',
      padding: scaledSpacing(isSmallScreen ? 2 : 4),
      width: isSmallScreen && subject.accuracy !== undefined ? '50%' : 'auto',
      marginBottom: isSmallScreen && subject.accuracy !== undefined ? scaledSpacing(4) : 0,
    },
    statValue: {
      fontSize: scaledFontSize(isSmallScreen ? 14 : isMediumScreen ? 15 : 24),
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    statLabel: {
      fontSize: scaledFontSize(isSmallScreen ? 9 : isMediumScreen ? 10 : 14),
      color: '#FFFFFF',
      textAlign: 'center',
    },
    searchContainer: {
      marginTop: scaledSpacing(isSmallScreen ? 6 : 8),
      //backgroundColor: 'rgba(255, 255, 255, 0.15)',
      //borderRadius: scaledRadius(theme.roundness),
      //padding: scaledSpacing(isSmallScreen ? 4 : 6),
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scaledSpacing(12),
      paddingVertical: scaledSpacing(isSmallScreen ? 6 : 8),
      borderRadius: scaledRadius(20),
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
    },
    searchIcon: {
      marginRight: scaledSpacing(12),
    },
    searchInput: {
      flex: 1,
      fontSize: scaledFontSize(isSmallScreen ? 12 : 16),
      padding: scaledSpacing(4),
      color: theme.colors.onSurface,
    },
  });

  // Render the search bar component separately so it can be used in both places
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={moderateScale(20)} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
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
          <View style={styles.contentContainer}>
            <Typography 
              variant="body1" 
              style={styles.description}
              numberOfLines={isSmallScreen ? 2 : 3}
            >
              {subject.description}
            </Typography>
            
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Typography style={styles.statValue}>
                  {subject.topicsCount}
                </Typography>
                <Typography style={styles.statLabel}>
                  Topics
                </Typography>
              </View>
              
              <View style={styles.statItem}>
                <Typography style={styles.statValue}>
                  {subject.questionsCount}
                </Typography>
                <Typography style={styles.statLabel}>
                  Questions
                </Typography>
              </View>
              
              <View style={styles.statItem}>
                <Typography style={styles.statValue}>
                  {subject.progress}%
                </Typography>
                <Typography style={styles.statLabel}>
                  Progress
                </Typography>
              </View>

              {subject.accuracy !== undefined && (
                <View style={styles.statItem}>
                  <Typography style={styles.statValue}>
                    {subject.accuracy}%
                  </Typography>
                  <Typography style={styles.statLabel}>
                    Accuracy
                  </Typography>
                </View>
              )}
            </View>
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
  const isSmallScreen = Dimensions.get('window').width < 360;
  
  const styles = StyleSheet.create({
    searchContainer: {
      marginTop: scaledSpacing(10),
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: scaledRadius(theme.roundness),
      padding: scaledSpacing(8),
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scaledSpacing(12),
      paddingVertical: scaledSpacing(isSmallScreen ? 6 : 8),
      borderRadius: scaledRadius(20),
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
    },
    searchIcon: {
      marginRight: scaledSpacing(12),
    },
    searchInput: {
      flex: 1,
      fontSize: scaledFontSize(isSmallScreen ? 12 : 16),
      padding: scaledSpacing(4),
      color: theme.colors.onSurface,
    },
  });
  
  return (
    <View style={[styles.searchContainer, style]}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={moderateScale(20)} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
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
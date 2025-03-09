import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Question } from '../types/quiz';
import { getBookmarkedQuestions, removeBookmark, addBookmark } from '../services/bookmarkService';
import { LoadingIndicator } from '../atoms/LoadingIndicator';
import { QuizQuestionCard } from '../molecules/QuizQuestionCard';
import { SwipeableQuestionCard } from '../molecules/SwipeableQuestionCard';
import { QuizResultHeader } from '../molecules/QuizResultHeader';
import { useNavigation } from '@react-navigation/native';

type ViewMode = 'scroll' | 'swipe';

export const BookmarksScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('scroll');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBookmarkedQuestions();
  }, []);

  const loadBookmarkedQuestions = async (page: number = 1, shouldRefresh: boolean = false) => {
    try {
      if (!shouldRefresh) setIsLoading(true);
      const result = await getBookmarkedQuestions(page);
      setBookmarkedQuestions(shouldRefresh ? [] : [...bookmarkedQuestions, ...result.questions]);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading bookmarked questions:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleBookmarkToggle = async (questionId: string, isCurrentlyBookmarked: boolean) => {
    try {
      if (isCurrentlyBookmarked) {
        await removeBookmark(questionId);
      } else {
        await addBookmark(questionId);
      }
      await loadBookmarkedQuestions(1, true);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoading) {
      loadBookmarkedQuestions(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookmarkedQuestions(1, true);
  };

  const handleSwipeLeft = () => {
    // Mark as hard
    if (currentIndex < bookmarkedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    // Mark as easy
    if (currentIndex < bookmarkedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
    },
    iconButton: {
      padding: 8,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.neuPrimary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    swipeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
  });

  if (isLoading) {
    return <LoadingIndicator message="Loading bookmarks..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Typography variant="h6">←</Typography>
          </TouchableOpacity>
          <Typography variant="h5" weight="bold" style={styles.headerTitle}>
            Bookmarks
          </Typography>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setViewMode(prev => prev === 'scroll' ? 'swipe' : 'scroll')}
            >
              <Typography variant="h6">{viewMode === 'scroll' ? '📜' : '🔄'}</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowFilters(prev => !prev)}
            >
              <Typography variant="h6">🔍</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {viewMode === 'scroll' ? (
        <FlatList
          data={bookmarkedQuestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <QuizQuestionCard
              question={item}
              attempt={{ questionId: item.id, selectedOptionId: item.correctOptionId, isSkipped: false }}
              index={index}
              isBookmarked={true}
              onBookmark={(questionId) => handleBookmarkToggle(questionId, true)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Typography variant="body1" color="onSurfaceVariant">
                No bookmarked questions found
              </Typography>
            </View>
          }
        />
      ) : (
        <View style={styles.swipeContainer}>
          {bookmarkedQuestions.length > 0 && (
            <SwipeableQuestionCard
              question={bookmarkedQuestions[currentIndex]}
              attempt={{
                questionId: bookmarkedQuestions[currentIndex].id,
                selectedOptionId: bookmarkedQuestions[currentIndex].correctOptionId,
                isSkipped: false,
              }}
              index={currentIndex}
              isBookmarked={true}
              onBookmark={(questionId) => handleBookmarkToggle(questionId, true)}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          )}
        </View>
      )}
    </View>
  );
};
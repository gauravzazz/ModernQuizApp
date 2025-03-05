import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { SearchBar } from '../atoms/SearchBar';
import { Button } from '../atoms/Button';
import { Question } from '../types/quiz';
import { getBookmarkedQuestions, removeBookmark } from '../services/bookmarkService';
import { LoadingIndicator } from '../atoms/LoadingIndicator';

export const BookmarksScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBookmarkedQuestions();
  }, []);

  const loadBookmarkedQuestions = async () => {
    try {
      setIsLoading(true);
      const questions = await getBookmarkedQuestions();
      setBookmarkedQuestions(questions);
    } catch (error) {
      console.error('Error loading bookmarked questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (questionId: string) => {
    try {
      await removeBookmark(questionId);
      // Refresh the list after removing
      await loadBookmarkedQuestions();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handlePractice = (question: Question) => {
    // TODO: Implement practice functionality
    console.log('Practice question:', question);
  };

  const filteredQuestions = bookmarkedQuestions.filter(question =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    searchContainer: {
      marginBottom: 24,
    },
    bookmarkCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    questionText: {
      marginBottom: 12,
    },
    optionsContainer: {
      marginTop: 8,
    },
    optionText: {
      marginBottom: 4,
      paddingLeft: 8,
    },
    correctOption: {
      color: theme.colors.success,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 8,
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
        <Typography variant="h4" weight="bold">
          Bookmarks
        </Typography>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <View key={question.id} style={styles.bookmarkCard}>
              <Typography
                variant="h6"
                weight="bold"
                style={styles.questionText}
              >
                {question.text}
              </Typography>
              <View style={styles.optionsContainer}>
                {question.options.map((option) => (
                  <Typography
                    key={option.id}
                    variant="body2"
                    style={[
                      styles.optionText,
                      option.id === question.correctOptionId && styles.correctOption,
                    ]}
                  >
                    {option.id}. {option.text}
                    {option.id === question.correctOptionId && ' ✓'}
                  </Typography>
                ))}
              </View>
              {question.explanation && (
                <Typography
                  variant="body2"
                  color="onSurfaceVariant"
                  style={{ marginTop: 8 }}
                >
                  Explanation: {question.explanation}
                </Typography>
              )}
              <View style={styles.actions}>
                <Button
                  label="Remove"
                  variant="outline"
                  size="small"
                  onPress={() => handleRemoveBookmark(question.id)}
                />
                <Button
                  label="Practice"
                  size="small"
                  onPress={() => handlePractice(question)}
                />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Typography variant="body1" color="onSurfaceVariant">
              No bookmarked questions found
            </Typography>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
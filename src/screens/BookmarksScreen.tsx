import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { SearchBar } from '../atoms/SearchBar';
import { Button } from '../atoms/Button';

interface BookmarkedQuestion {
  id: string;
  question: string;
  subject: string;
  quiz: string;
  answer: string;
  dateBookmarked: string;
}

const mockBookmarks: BookmarkedQuestion[] = [
  {
    id: '1',
    question: 'What is the square root of 144?',
    subject: 'Mathematics',
    quiz: 'Basic Algebra',
    answer: '12',
    dateBookmarked: '2023-12-01',
  },
  {
    id: '2',
    question: 'What is the chemical symbol for gold?',
    subject: 'Science',
    quiz: 'Chemistry Basics',
    answer: 'Au',
    dateBookmarked: '2023-12-02',
  },
];

export const BookmarksScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();

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
    metadata: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    answerContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.roundness,
      padding: 12,
      marginTop: 8,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" weight="bold">
          Bookmarks
        </Typography>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar placeholder="Search bookmarks..." />
      </View>
      <ScrollView>
        {mockBookmarks.map((bookmark) => (
          <View key={bookmark.id} style={styles.bookmarkCard}>
            <Typography
              variant="h6"
              weight="bold"
              style={styles.questionText}
            >
              {bookmark.question}
            </Typography>
            <View style={styles.metadata}>
              <Typography variant="caption" color="onSurfaceVariant">
                {bookmark.subject} • {bookmark.quiz}
              </Typography>
              <Typography variant="caption" color="onSurfaceVariant">
                {bookmark.dateBookmarked}
              </Typography>
            </View>
            <View style={styles.answerContainer}>
              <Typography variant="body2" color="onSurfaceVariant">
                Answer: {bookmark.answer}
              </Typography>
            </View>
            <View style={styles.actions}>
              <Button
                label="Remove"
                variant="outline"
                size="small"
                onPress={() => {}}
              />
              <Button
                label="Practice"
                size="small"
                onPress={() => {}}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
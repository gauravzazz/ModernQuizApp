import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { LoadingIndicator } from '../atoms/LoadingIndicator';
import { getQuizHistory } from '../services/quizResultService';
import { ProcessedQuizResult } from '../services/quizResultService';
import { QuizResultHeader } from '../molecules/QuizResultHeader';
import { QuizHistoryCard } from '../molecules/QuizHistoryCard';

export const QuizHistoryScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [quizHistory, setQuizHistory] = useState<ProcessedQuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load quiz history when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadQuizHistory();
      return () => {};
    }, [])
  );

  const loadQuizHistory = async () => {
    try {
      const history = await getQuizHistory();
      setQuizHistory(history);
    } catch (error) {
      console.error('Error loading quiz history:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadQuizHistory();
  }, []);

  const handleQuizCardPress = (quizResult: ProcessedQuizResult) => {
    // Navigate through MainStack to reach QuizResult
    navigation.navigate('MainStack', {
      screen: 'QuizResult',
      params: {
        attempts: quizResult.attempts,
        totalTime: quizResult.duration,
        mode: quizResult.mode,
        subjectId: quizResult.subjectId,
        topicId: quizResult.topicId,
        topicTitle: quizResult.quiz,
        subjectTitle: quizResult.subject,
        fromHistory: true,
        questionIds: quizResult.questionIds
      }
    });
  };

  const renderQuizCard = ({ item }: { item: ProcessedQuizResult }) => {
    return (
      <QuizHistoryCard 
        quizResult={item} 
        onPress={handleQuizCardPress} 
      />
    );
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading quiz history..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <QuizResultHeader title="Quiz History" />
      
      {quizHistory.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Typography variant="h3">No Quiz History</Typography>
          <Typography variant="body1" style={styles.emptyText}>
            Complete some quizzes to see your history here!
          </Typography>
        </View>
      ) : (
        <FlatList
          data={quizHistory}
          renderItem={renderQuizCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
});
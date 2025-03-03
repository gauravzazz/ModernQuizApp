import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../atoms/ProgressBar';
import { RootStackParamList } from '../navigation';
import { saveQuizResults } from '../utils/quizResultsStorage';

type QuizResultScreenRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;
type QuizResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuizResultScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const navigation = useNavigation<QuizResultScreenNavigationProp>();
  const { attempts, totalTime, mode, subjectId, topicId, questionsData } = route.params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 32,
    },
    resultCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 24,
      marginBottom: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
    },
    statItem: {
      alignItems: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 32,
    },
  });

  const correctAnswers = attempts.filter(
    (attempt) => !attempt.isSkipped && attempt.selectedOptionId === attempt.correctOptionId
  ).length;

  const score = Math.round((correctAnswers / attempts.length) * 100);
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);
  
  // Create a map of time spent per question
  const timePerQuestion = attempts.reduce((acc, attempt) => {
    acc[attempt.questionId] = attempt.timeSpent;
    return acc;
  }, {} as Record<string, number>);
  
  // Save quiz results to AsyncStorage
  useEffect(() => {
    // Log all data being passed to QuizResultScreen
    console.log('===== QUIZ RESULT SCREEN DATA =====');
    console.log('attempts:', JSON.stringify(attempts, null, 2));
    console.log('totalTime:', totalTime);
    console.log('mode:', mode);
    console.log('subjectId:', subjectId);
    console.log('topicId:', topicId);
    console.log('questionsData:', JSON.stringify(questionsData, null, 2));
    console.log('timePerQuestion:', JSON.stringify(timePerQuestion, null, 2));
    console.log('correctAnswers:', correctAnswers);
    console.log('score:', score);
    console.log('================================');
    
    const saveResults = async () => {
      await saveQuizResults({
        subjectId,
        topicId,
        mode,
        correctAnswers,
        totalQuestions: attempts.length,
        timePerQuestion
      });
    };
    
    saveResults();
  }, [subjectId, topicId, mode, correctAnswers, attempts.length, timePerQuestion]);
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h4" weight="bold">
          Quiz Results
        </Typography>
      </View>

      <ScrollView>
        <View style={styles.resultCard}>
          <View style={styles.scoreContainer}>
            <Typography variant="h1" weight="bold" color="primary">
              {score}%
            </Typography>
            <Typography variant="h6" color="onSurfaceVariant">
              {mode} Mode
            </Typography>
          </View>

          <ProgressBar progress={score / 100} />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Typography variant="h5" weight="bold" color="primary">
                {correctAnswers}
              </Typography>
              <Typography variant="caption" color="onSurfaceVariant">
                Correct Answers
              </Typography>
            </View>

            <View style={styles.statItem}>
              <Typography variant="h5" weight="bold" color="primary">
                {attempts.length}
              </Typography>
              <Typography variant="caption" color="onSurfaceVariant">
                Total Questions
              </Typography>
            </View>

            <View style={styles.statItem}>
              <Typography variant="h5" weight="bold" color="primary">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </Typography>
              <Typography variant="caption" color="onSurfaceVariant">
                Time Taken
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            label="Try Again"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={{ flex: 1 }}
          />
          <Button
            label="Back to Home"
            variant="primary"
            onPress={() => navigation.navigate('Home')}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
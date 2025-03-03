import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SubjectDetailScreen } from '../screens/SubjectDetailScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { QuizHistoryScreen } from '../screens/QuizHistoryScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NotificationScreen } from '../screens/NotificationScreen';

export type RootStackParamList = {
  Home: undefined;
  SubjectDetail: { subjectId: string; title: string };
  Quiz: {
    questionCount: number;
    mode: 'Practice' | 'Test';
    topicId?: string;
    subjectId?: string;
  };
  QuizResult: {
    attempts: Array<{
      questionId: string;
      selectedOptionId: string | null;
      correctOptionId: string;
      timeSpent: number;
      isSkipped: boolean;
      question?: string;
      options?: Array<{
        id: string;
        text: string;
      }>;
    }>;
    totalTime: number;
    mode: 'Practice' | 'Test';
    subjectId?: string;
    topicId?: string;
    questionsData?: Array<{
      id: string;
      text: string;
      options: Array<{
        id: string;
        text: string;
      }>;
      correctOptionId: string;
    }>;
  };
  Bookmarks: undefined;
  QuizHistory: undefined;
  Progress: undefined;
  Settings: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="QuizResult" component={QuizResultScreen} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
        <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
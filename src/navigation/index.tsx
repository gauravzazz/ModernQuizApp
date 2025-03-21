import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeScreen } from '../screens/HomeScreen';
import { SubjectDetailScreen } from '../screens/SubjectDetailScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { BookmarksScreen } from '../screens/BookmarksScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomDrawerContent } from '../components/CustomDrawerContent';
import { QuizHistoryScreen } from '../screens/QuizHistoryScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
export type RootStackParamList = {
  Home: undefined;
  MainStack: undefined | {
    screen: string;
    params: {
      questionCount?: number;
      mode?: 'Practice' | 'Test';
      topicId?: string;
      subjectId?: string;
      topicTitle?: string;
      subjectTitle?: string;
    } | { subjectId: string; title: string };
  };
  SubjectDetail: { subjectId: string; title: string };
  Quiz: {
    questionCount: number;
    mode: 'Practice' | 'Test';
    topicId?: string;
    subjectId?: string;
    topicTitle?: string;
    subjectTitle?: string;
    fromHistory: boolean;
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
    topicTitle?: string;
    subjectTitle?: string;
    fromHistory?: boolean;

    questionIds?: string[];
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
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          overlayColor: 'rgba(0,0,0,0.5)',
          drawerStyle: {
            width: '80%',
          }
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="MainStack" component={MainStack} />
        <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
        <Drawer.Screen name="QuizHistory" component={QuizHistoryScreen} />
        <Drawer.Screen name="Progress" component={ProgressScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Notifications" component={NotificationScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
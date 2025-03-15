import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from './src/navigation';
import { NotificationProvider, useNotifications } from './src/context/NotificationContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { NotificationService } from './src/services/notificationService';
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

const AppContent = () => {
  const { theme } = useThemeContext();
  const { addNotification } = useNotifications();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('@onboarding_completed');
        setHasCompletedOnboarding(onboardingCompleted === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      }
    };

    checkOnboardingStatus();
    NotificationService.registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      addNotification({
        title: title || 'New Notification',
        message: body || '',
        type: 'info'
      });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      // Handle notification response/interaction here
      console.log('Notification interaction:', data);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [addNotification]);

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  if (isLoading) {
    return <SplashScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <Navigation />
        </SafeAreaView>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}
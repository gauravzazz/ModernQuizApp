import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Navigation } from './src/navigation';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';

const AppContent = () => {
  const { theme } = useThemeContext();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Navigation />
      </SafeAreaView>
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
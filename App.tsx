import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './src/theme';
import { Navigation } from './src/navigation';
import { NotificationProvider } from './src/context/NotificationContext';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <PaperProvider theme={theme}>
      <NotificationProvider>
        <SafeAreaView style={styles.container}>
          <Navigation />
        </SafeAreaView>
      </NotificationProvider>
    </PaperProvider>
  );
}
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: typeof lightTheme | typeof darkTheme;
  themeType: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'light',
  toggleTheme: () => {},
  isDarkMode: false,
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('light');
  
  // Determine if dark mode is active
  const isDarkMode = themeType === 'dark';
  
  // Get the appropriate theme object
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Toggle between light and dark themes
  const toggleTheme = async () => {
    const newThemeType = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newThemeType);
    try {
      await AsyncStorage.setItem('@theme_preference', newThemeType);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Load saved theme preference on initial render
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_preference');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeType(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
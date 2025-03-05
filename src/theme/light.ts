export const lightColors = {
  // Primary colors
  primary: '#2196F3',
  primaryContainer: '#E3F2FD',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0D47A1',

  // Secondary colors
  secondary: '#90CAF9',
  secondaryContainer: '#BBDEFB',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1565C0',

  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceVariant: '#E0E0E0',
  onBackground: '#000000',
  onSurface: '#000000',
  onSurfaceVariant: '#4A4A4D',

  // Status colors
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',

  // Custom colors for quiz app
  quizCard: '#FFFFFF',
  quizCardBorder: 'rgba(33, 150, 243, 0.1)',
  quizCardShadow: 'rgba(0, 0, 0, 0.1)',
  optionButton: '#FFFFFF',
  optionButtonBorder: 'rgba(33, 150, 243, 0.15)',
  optionButtonSelected: '#E3F2FD',
  progressBar: '#E3F2FD',
  progressBarFill: '#2196F3',

  neuPrimary: '#E8E8E8',
  neuLight: 'rgba(255, 255, 255, 0.9)',
  neuDark: 'rgba(185, 192, 205, 0.9)',
  elevation: {
    level0: { shadowColor: 'transparent', elevation: 0 },
    level1: {
      shadowColor: 'rgba(185, 192, 205, 0.9)', // neuDark
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.9,
      shadowRadius: 6,
      elevation: 3,
    },
    level2: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 5,
    },
    // Add more levels as needed
  },
  pressedElevation: {
    level1: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: -3, height: -3 },
      shadowOpacity: 0.9,
      shadowRadius: 6,
      elevation: 3,
    },
    level2: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: -5, height: -5 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 5,
    },
  },
};
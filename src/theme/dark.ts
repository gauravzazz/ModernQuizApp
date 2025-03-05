export const darkColors = {
  // Primary colors
  primary: '#8B85FF',
  primaryContainer: '#1E1B4B',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#ECF0FF',

  // Secondary colors
  secondary: '#03DAC6',
  secondaryContainer: '#0A2422',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#E5F8F6',

  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#CCCCCC',

  // Status colors
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
  info: '#0A84FF',

  // Custom colors for quiz app
  quizCard: '#1E1E1E',
  quizCardBorder: 'rgba(139, 133, 255, 0.1)',
  quizCardShadow: 'rgba(0, 0, 0, 0.3)',
  optionButton: '#2C2C2C',
  optionButtonBorder: 'rgba(139, 133, 255, 0.15)',
  optionButtonSelected: '#1E1B4B',
  progressBar: '#2C2C2C',
  progressBarFill: '#8B85FF',

  // Neumorphic effects
  neuPrimary: '#2C2C2C',
  neuLight: 'rgba(60, 60, 60, 0.9)',
  neuDark: 'rgba(15, 15, 15, 0.9)',
  elevation: {
    level0: { shadowColor: 'transparent', elevation: 0 },
    level1: {
      shadowColor: 'rgba(15, 15, 15, 0.9)', // neuDark
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.9,
      shadowRadius: 6,
      elevation: 3,
    },
    level2: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 5,
    },
    // Add more levels as needed
  },
  pressedElevation: {
    level1: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: -3, height: -3 },
      shadowOpacity: 0.9,
      shadowRadius: 6,
      elevation: 3,
    },
    level2: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: -5, height: -5 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 5,
    },
  },
};
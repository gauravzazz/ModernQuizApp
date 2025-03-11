// Gradient color definitions for UI elements
export const darkGradients = {
  primary: ['#8B85FF', '#1E1B4B'] as const,
  success: ['#32D74B', '#0A2422'] as const,
  info: ['#0A84FF', '#0A2840'] as const,
  warning: ['#FF9F0A', '#3D2800'] as const,
  error: ['#FF453A', '#3D0D0A'] as const
};

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
  errorContainer: '#3D0D0A',
  success: '#32D74B',
  successContainer: '#0A2422',
  warning: '#FF9F0A',
  warningContainer: '#3D2800',
  info: '#0A84FF',
  infoContainer: '#0A2840',

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
    level0: 'none',
    level1: '0px 3px 3px rgba(15, 15, 15, 0.9)',
    level2: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 5,
    },
    level3: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.9,
      shadowRadius: 15,
      elevation: 8,
    },
    level4: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: 12, height: 12 },
      shadowOpacity: 0.9,
      shadowRadius: 20,
      elevation: 12,
    },
    level5: {
      shadowColor: 'rgba(15, 15, 15, 0.9)',
      shadowOffset: { width: 16, height: 16 },
      shadowOpacity: 0.9,
      shadowRadius: 25,
      elevation: 16,
    }
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
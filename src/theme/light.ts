// Gradient color definitions for UI elements
export const lightGradients = {
  primary: ['#2196F3', '#E3F2FD'] as const,
  success: ['#4CAF50', '#A5D6A7'] as const,
  info: ['#2196F3', '#64B5F6'] as const,
  warning: ['#FF9800', '#FFB74D'] as const,
  error: ['#F44336', '#E57373'] as const
};

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
  errorContainer: '#FFEBEE',
  success: '#4CAF50',
  successContainer: '#E8F5E9',
  warning: '#FFC107',
  warningContainer: '#FFF8E1',
  info: '#2196F3',
  infoContainer: '#E3F2FD',

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
    level0: 'none',
    level1: '0px 3px 3px rgba(185, 192, 205, 0.9)',
    level2: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      elevation: 5,
    },
    level3: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.9,
      shadowRadius: 15,
      elevation: 8,
    },
    level4: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: 12, height: 12 },
      shadowOpacity: 0.9,
      shadowRadius: 20,
      elevation: 12,
    },
    level5: {
      shadowColor: 'rgba(185, 192, 205, 0.9)',
      shadowOffset: { width: 16, height: 16 },
      shadowOpacity: 0.9,
      shadowRadius: 25,
      elevation: 16,
    }
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
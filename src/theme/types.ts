import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

export interface CustomColors {
  // Neumorphic colors
  neuPrimary: string;
  neuLight: string;
  neuDark: string;

  // Custom quiz app colors
  quizCard: string;
  quizCardBorder: string;
  quizCardShadow: string;
  optionButton: string;
  optionButtonBorder: string;
  optionButtonSelected: string;
  progressBar: string;
  progressBarFill: string;
  success: string;
  error: string;

  // Custom elevation
  elevation: {
    level0: {
      shadowColor: string;
      elevation: number;
    };
    level1: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    level2: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export interface AppColors extends MD3Colors, CustomColors {}
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

interface ElevationLevel {
  shadowColor: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation: number;
}

interface CustomElevation {
  level0: ElevationLevel;
  level1: ElevationLevel;
  level2: ElevationLevel;
}

export interface CustomColors extends Omit<MD3Colors, 'elevation'> {
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
  warning: string;

  // Custom elevation
  elevation: CustomElevation;
}

export interface AppColors extends CustomColors {}
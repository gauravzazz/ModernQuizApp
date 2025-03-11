import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

interface ElevationLevel {
  shadowColor: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation: number;
}

// This interface matches what MD3Colors expects (all string values)
interface CustomElevation {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
  // Add index signature for numeric keys to match MD3ElevationColors
  [key: number]: string;
}

// This interface is for our actual implementation with complex elevation objects
interface CustomElevationImpl {
  level0: string;
  level1: string;
  level2: ElevationLevel;
  level3: ElevationLevel;
  level4: ElevationLevel;
  level5: ElevationLevel;
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

// This interface represents our actual implementation with complex elevation objects
export interface AppColorsImpl {
  // Extends all properties from CustomColors
  [key: string]: any;
  
  // Override the elevation property with our implementation type
  elevation: CustomElevationImpl;
  pressedElevation?: {
    level1: ElevationLevel;
    level2: ElevationLevel;
  };
}

export interface AppColors extends CustomColors {}

// Use AppColorsImpl when working with the actual theme implementation
// but expose AppColors as the public interface type
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

interface ElevationLevel {
  shadowColor: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation: number;
}

// Convert ElevationLevel to string representation for MD3Theme compatibility
const elevationToString = (level: ElevationLevel): string => {
  return `rgba(0,0,0,${level.shadowOpacity || 0})`;
};

// Internal interface for managing elevation with shadow properties
export interface ElevationConfig {
  level0: string;
  level1: string;
  level2: ElevationLevel;
  level3: ElevationLevel;
  level4: ElevationLevel;
  level5: ElevationLevel;
}

// Helper function to convert ElevationConfig to MD3Theme compatible format
export const convertElevationConfig = (config: ElevationConfig) => ({
  level0: config.level0,
  level1: config.level1,
  level2: elevationToString(config.level2),
  level3: elevationToString(config.level3),
  level4: elevationToString(config.level4),
  level5: elevationToString(config.level5),
});

// This interface matches what MD3Colors expects
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
  info: string;
  
  // Container colors for status colors
  successContainer: string;
  errorContainer: string;
  warningContainer: string;
  infoContainer: string;

  // Elevation levels as strings for MD3Theme compatibility
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}

// Gradient color pairs for different UI elements
export interface GradientColors {
  primary: string[];
  success: string[];
  info: string[];
  warning: string[];
  error: string[];
}

// This interface represents our actual implementation with complex elevation objects
export interface AppColorsImpl {
  // Extends all properties from CustomColors except elevation
  [key: string]: any;
  
  // Override the elevation property with our implementation type
  elevation: ElevationConfig;
  pressedElevation?: {
    level1: ElevationLevel;
    level2: ElevationLevel;
  };
}

export interface AppColors extends CustomColors {}

// Use AppColorsImpl when working with the actual theme implementation
// but expose AppColors as the public interface type
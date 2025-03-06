import { DefaultTheme as NavigationLightTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { darkColors } from './dark'; 
import { lightColors } from './light';
import { AppColors } from './types';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: MD3LightTheme,
  materialDark: MD3DarkTheme
});

export const lightTheme = {
  ...LightTheme,
  ...MD3LightTheme,
  colors: {
    ...LightTheme.colors,
    ...MD3LightTheme.colors,
    ...lightColors,
  } as AppColors,
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export const darkTheme = {
  ...DarkTheme,
  ...MD3DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...MD3DarkTheme.colors,
    ...darkColors,
  } as AppColors,
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export type AppTheme = typeof lightTheme;
import { DefaultTheme as NavigationLightTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { darkColors, darkGradients } from './dark'; 
import { lightColors, lightGradients } from './light';
import { AppColors, convertElevationConfig } from './types';

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
    elevation: convertElevationConfig(lightColors.elevation),
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
    elevation: convertElevationConfig(darkColors.elevation),
  } as AppColors,
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export type AppTheme = typeof lightTheme;

export { lightGradients, darkGradients };

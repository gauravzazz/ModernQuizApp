import '@react-native-material/core';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

declare module 'react-native-paper/lib/typescript/types' {
  export interface MD3Colors {
    neuPrimary: string;
    neuLight: string;
    neuDark: string;
  }
}
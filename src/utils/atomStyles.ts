import { moderateScale, scaledSpacing, scaledFontSize, scaledRadius } from './scaling';
import { AppTheme } from '../theme';

export const getSharedAtomStyles = (theme: AppTheme) => ({
  shadows: {
    neuDark: {
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(6),
      elevation: 8,
    },
    neuLight: {
      shadowColor: theme.colors.neuLight,
      shadowOffset: { width: -moderateScale(2), height: -moderateScale(2) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(4),
      elevation: 2,
    },
  },
  containers: {
    rounded: {
      borderRadius: scaledRadius(theme.roundness),
      overflow: 'hidden',
    },
    padded: (size: 'sm' | 'md' | 'lg' = 'md') => ({
      padding: scaledSpacing(
        size === 'sm' ? 8 : 
        size === 'lg' ? 16 : 12
      ),
    }),
  },
  transitions: {
    fast: { duration: 150 },
    medium: { duration: 300 },
  },
  typography: {
    button: {
      fontSize: scaledFontSize(14),
      letterSpacing: moderateScale(0.5),
      fontWeight: '600' as const,
    },
    label: {
      fontSize: scaledFontSize(12),
      lineHeight: scaledFontSize(16),
    },
  },
});
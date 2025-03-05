import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { scaledFontSize } from '../utils/scaling';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'button';
  color?: keyof AppTheme['colors'];
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'bold';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'onBackground',
  align = 'left',
  weight = 'normal',
  style,
  children,
  ...props
}) => {
  const theme = useTheme<AppTheme>();

  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return scaledFontSize(32);
      case 'h2':
        return scaledFontSize(28);
      case 'h3':
        return scaledFontSize(24);
      case 'h4':
        return scaledFontSize(20);
      case 'h5':
        return scaledFontSize(18);
      case 'h6':
        return scaledFontSize(16);
      case 'body1':
        return scaledFontSize(16);
      case 'body2':
        return scaledFontSize(14);
      case 'caption':
        return scaledFontSize(12);
      case 'button':
        return scaledFontSize(14);
      default:
        return scaledFontSize(16);
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'bold':
        return '700';
      case 'medium':
        return '500';
      default:
        return '400';
    }
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: getFontSize(),
      fontWeight: getFontWeight(),
      color: theme.colors[color] as string,
      textAlign: align,
      letterSpacing: variant === 'button' ? 0.5 : 0.15,
    },
  });

  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};
import React from 'react';
import { StyleSheet, View, Image, ViewStyle, ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';

export interface AvatarProps {
  size?: 'small' | 'medium' | 'large';
  source?: ImageSourcePropType;
  initials?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  source,
  initials,
  style,
}) => {
  const theme = useTheme<AppTheme>();

  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 24;
      default:
        return 18;
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: getSize(),
      height: getSize(),
      borderRadius: getSize() / 2,
      backgroundColor: theme.colors.neuPrimary,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    initialsText: {
      fontSize: getFontSize(),
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {source ? (
        <Image source={source} style={styles.image} resizeMode="cover" />
      ) : (
        <Typography
          style={styles.initialsText}
          weight="medium"
        >
          {initials?.toUpperCase() ?? '?'}
        </Typography>
      )}
    </View>
  );
};
import React from 'react';
import { StyleSheet, View, Image, ViewStyle, ImageSourcePropType } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { moderateScale, scaledFontSize } from '../utils/scaling';

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
        return moderateScale(32);
      case 'large':
        return moderateScale(64);
      default:
        return moderateScale(48);
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return scaledFontSize(14);
      case 'large':
        return scaledFontSize(24);
      default:
        return scaledFontSize(18);
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
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(10),
      elevation: moderateScale(10),
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
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(1),
    },
  });

  return (
    <View style={[styles.container, style]}>
      {source ? (
        <Image source={source} style={styles.image} resizeMode="cover" />
      ) : (
        <Typography style={styles.initialsText} weight="medium">
          {initials?.toUpperCase() ?? '?'}
        </Typography>
      )}
    </View>
  );
};
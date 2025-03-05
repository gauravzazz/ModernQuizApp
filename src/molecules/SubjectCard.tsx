import React from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface SubjectCardProps {
  title: string;
  description: string;
  progress: number;
  icon?: string;
  backgroundImage?: string;
  onPress?: () => void;
  style?: any;
  width?: number; // Width prop from parent (e.g., SubjectGrid)
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  description,
  progress,
  icon,
  backgroundImage,
  onPress,
  style,
  width,
}) => {
  const theme = useTheme();
  const isSmallScreen = SCREEN_WIDTH < 360;
  const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 600;
  const isLargeScreen = SCREEN_WIDTH >= 600;

  const [isCardPressed, setIsCardPressed] = React.useState(false);
  const [isButtonPressed, setIsButtonPressed] = React.useState(false);

  // Default width if not provided by parent
  const defaultWidth = isSmallScreen ? SCREEN_WIDTH - scaledSpacing(20) : // Full width minus padding on small screens
    isMediumScreen ? moderateScale(280) :
    moderateScale(320);

  const cardWidth = width !== undefined ? width : defaultWidth;

  const styles = StyleSheet.create({
    container: {
      overflow: 'hidden',
      width: cardWidth,
      height: moderateScale(isSmallScreen ? 200 : isMediumScreen ? 220 : 240),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      marginBottom: scaledSpacing(16),
    },
    cardContentContainer: {
      padding: scaledSpacing(isSmallScreen ? 10 : isMediumScreen ? 16 : 20),
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaledSpacing(isSmallScreen ? 8 : 12),
      gap: scaledSpacing(isSmallScreen ? 8 : 12),
    },
    icon: {
      width: moderateScale(isSmallScreen ? 32 : isMediumScreen ? 40 : 48),
      height: moderateScale(isSmallScreen ? 32 : isMediumScreen ? 40 : 48),
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness),
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      overflow: 'hidden',
    },
    description: {
      marginTop: scaledSpacing(isSmallScreen ? 2 : 4),
      marginBottom: scaledSpacing(isSmallScreen ? 8 : 12),
      opacity: 0.7,
      fontSize: scaledFontSize(isSmallScreen ? 12 : isMediumScreen ? 14 : 16),
    },
    progressContainer: {
      flexDirection: isSmallScreen ? 'column' : 'row',
      alignItems: isSmallScreen ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      marginTop: scaledSpacing(isSmallScreen ? 6 : 10),
    },
    progressWrapper: {
      flex: 1,
      marginBottom: isSmallScreen ? scaledSpacing(8) : 0,
      width: isSmallScreen ? '100%' : 'auto',
    },
    progressText: {
      marginLeft: scaledSpacing(8),
      fontSize: scaledFontSize(12),
    },
    continueButton: {
      backgroundColor: theme.colors.neuPrimary,
      paddingHorizontal: scaledSpacing(isSmallScreen ? 12 : 16),
      paddingVertical: scaledSpacing(isSmallScreen ? 6 : 8),
      borderRadius: scaledRadius(theme.roundness),
      width: isSmallScreen ? '100%' : 'auto',
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
  });

  const containerShadow = {
    shadowColor: theme.colors.neuDark,
    shadowOffset: isCardPressed ? { width: moderateScale(-2), height: moderateScale(-2) } : { width: moderateScale(4), height: moderateScale(4) },
    shadowOpacity: isCardPressed ? 0.2 : 0.3,
    shadowRadius: moderateScale(12),
    elevation: isCardPressed ? moderateScale(2) : moderateScale(8),
  };

  const buttonShadow = {
    shadowColor: theme.colors.neuDark,
    shadowOffset: isButtonPressed ? { width: moderateScale(-1), height: moderateScale(-1) } : { width: moderateScale(2), height: moderateScale(2) },
    shadowOpacity: isButtonPressed ? 0.2 : 0.4,
    shadowRadius: moderateScale(4),
    elevation: isButtonPressed ? moderateScale(1) : moderateScale(4),
  };

  const buttonStyle = [
    styles.continueButton,
    buttonShadow,
    { transform: [{ scale: isButtonPressed ? 0.98 : 1 }] },
  ];

  const CardContent = () => (
    <>
      <View style={styles.header}>
        {icon && (
          <View style={styles.icon}>
            <Typography
              color="onPrimary"
              style={{ fontSize: scaledFontSize(isSmallScreen ? 20 : isMediumScreen ? 24 : 28) }}
            >
              {icon}
            </Typography>
          </View>
        )}
        <View style={styles.content}>
          <Typography
            variant="h6"
            weight="bold"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: scaledFontSize(isSmallScreen ? 16 : isMediumScreen ? 18 : 20) }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="onSurfaceVariant"
            style={styles.description}
            numberOfLines={isSmallScreen ? 2 : 3}
            ellipsizeMode="tail"
          >
            {description}
          </Typography>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} />
          <Typography
            variant="caption"
            color="onSurfaceVariant"
            style={styles.progressText}
          >
            {`${Math.round(progress * 100)}% Complete`}
          </Typography>
        </View>
        <TouchableOpacity
          style={buttonStyle}
          onPress={onPress}
          onPressIn={() => setIsButtonPressed(true)}
          onPressOut={() => setIsButtonPressed(false)}
          activeOpacity={1}
        >
          <Typography
            variant="button"
            color="onSurface"
            style={{ fontSize: scaledFontSize(14) }}
          >
            Continue
          </Typography>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.container, containerShadow, style]}
      onPress={onPress}
      onPressIn={() => setIsCardPressed(true)}
      onPressOut={() => setIsCardPressed(false)}
      activeOpacity={1}
    >
      {backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
          imageStyle={{
            borderRadius: theme.roundness * 2,
            opacity: 0.15,
          }}
        >
          <View style={styles.cardContentContainer}>
            <CardContent />
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.cardContentContainer}>
          <CardContent />
        </View>
      )}
    </TouchableOpacity>
  );
};
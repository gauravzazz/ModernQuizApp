import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, ImageBackground, Platform, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { ProgressBar } from './ProgressBar';
import { scaledSpacing, moderateScale, scaledIconSize, scaledRadius, scaledFontSize, scaledShadow } from '../utils/scaling';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SubjectCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  onPress?: () => void;
  width?: number;
  id?: string;
  backgroundImage?: string;
}

import { addRecentSubject } from '../utils/recentSubjectsStorage';

export const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  description,
  icon,
  progress,
  onPress,
  width,
  id,
  backgroundImage,
}) => {
  const theme = useTheme<AppTheme>();
  const isSmallScreen = SCREEN_WIDTH < 360;
  const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 600;
  const isLargeScreen = SCREEN_WIDTH >= 600;
  
  const [isPressed, setIsPressed] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  
  // Animation when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      width: width !== undefined ? width : (isSmallScreen ? '100%' : isMediumScreen ? moderateScale(280) : moderateScale(320)),
      height: moderateScale(isSmallScreen ? 180 : isMediumScreen ? 200 : 220),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: backgroundImage ? 0 : scaledSpacing(isSmallScreen ? 14 : isMediumScreen ? 16 : 20),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaledSpacing(isSmallScreen ? 10 : isMediumScreen ? 14 : 18),
      gap: scaledSpacing(isSmallScreen ? 10 : isMediumScreen ? 14 : 18),
    },
    iconContainer: {
      width: moderateScale(isSmallScreen ? 42 : isMediumScreen ? 50 : 58),
      height: moderateScale(isSmallScreen ? 42 : isMediumScreen ? 50 : 58),
      backgroundColor: backgroundImage ? 'rgba(255,255,255,0.9)' : theme.colors.background,
      borderRadius: scaledRadius(theme.roundness * 1.5),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: theme.dark ? 0.25 : 0.2,
      shadowRadius: moderateScale(theme.dark ? 5 : 4),
      elevation: moderateScale(4),
      borderWidth: 0.5,
      borderColor: backgroundImage ? 'rgba(255,255,255,0.5)' : theme.colors.neuLight,
    },
    icon: {
      fontSize: scaledIconSize(isSmallScreen ? 22 : isMediumScreen ? 26 : 30),
      color: backgroundImage ? theme.colors.primary : undefined,
    },
    content: {
      flex: 1,
      overflow: 'hidden',
      justifyContent: 'center',
    },
    title: {
      fontSize: scaledFontSize(isSmallScreen ? 16 : isMediumScreen ? 18 : 20),
      marginBottom: scaledSpacing(isSmallScreen ? 3 : isMediumScreen ? 4 : 5),
      color: backgroundImage ? '#FFFFFF' : undefined,
      textShadowColor: backgroundImage ? 'rgba(0,0,0,0.5)' : 'transparent',
      textShadowOffset: backgroundImage ? { width: 1, height: 1 } : { width: 0, height: 0 },
      textShadowRadius: backgroundImage ? 3 : 0,
      letterSpacing: 0.4,
      fontWeight: '700',
    },
    description: {
      fontSize: scaledFontSize(isSmallScreen ? 12 : isMediumScreen ? 14 : 15),
      opacity: backgroundImage ? 0.95 : 0.8,
      marginBottom: scaledSpacing(isSmallScreen ? 1 : isMediumScreen ? 2 : 3),
      color: backgroundImage ? '#FFFFFF' : undefined,
      textShadowColor: backgroundImage ? 'rgba(0,0,0,0.3)' : 'transparent',
      textShadowOffset: backgroundImage ? { width: 0.5, height: 0.5 } : { width: 0, height: 0 },
      textShadowRadius: backgroundImage ? 2 : 0,
      lineHeight: scaledFontSize(isSmallScreen ? 16 : isMediumScreen ? 20 : 22),
    },
    progressContainer: {
      marginTop: scaledSpacing(isSmallScreen ? 12 : isMediumScreen ? 16 : 20),
      backgroundColor: backgroundImage ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.03)',
      padding: backgroundImage ? scaledSpacing(12) : scaledSpacing(10),
      paddingBottom: backgroundImage ? scaledSpacing(10) : scaledSpacing(8),
      borderRadius: scaledRadius(theme.roundness * 1.5),
      borderWidth: backgroundImage ? 0 : 0.5,
      borderColor: 'rgba(255,255,255,0.15)',
    },
    progressWrapper: {
      flex: 1,
    },
    progressText: {
      marginTop: scaledSpacing(isSmallScreen ? 6 : isMediumScreen ? 8 : 10),
      fontSize: scaledFontSize(isSmallScreen ? 11 : 12),
      color: backgroundImage ? '#FFFFFF' : undefined,
      textShadowColor: backgroundImage ? 'rgba(0,0,0,0.3)' : 'transparent',
      textShadowOffset: backgroundImage ? { width: 0.5, height: 0.5 } : { width: 0, height: 0 },
      textShadowRadius: backgroundImage ? 1 : 0,
      fontWeight: '600',
      textAlign: 'center',
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      padding: scaledSpacing(isSmallScreen ? 16 : isMediumScreen ? 20 : 24),
      flex: 1,
      justifyContent: 'space-between',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)',
      borderRadius: scaledRadius(theme.roundness * 2),
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: scaledRadius(theme.roundness * 2),
    },
  });

  // Enhanced shadow
  const containerShadow = {
    shadowColor: theme.colors.neuDark,
    shadowOffset: isPressed
      ? { width: moderateScale(-2), height: moderateScale(-2) }
      : { width: moderateScale(5), height: moderateScale(5) },
    shadowOpacity: isPressed ? (theme.dark ? 0.2 : 0.15) : (theme.dark ? 0.35 : 0.25),
    shadowRadius: moderateScale(theme.dark ? 12 : 10),
    elevation: isPressed ? moderateScale(2) : moderateScale(8),
    borderColor: theme.dark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
  };

  const CardContent = () => (
    <>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Typography style={styles.icon}>{icon}</Typography>
        </View>
        <View style={styles.content}>
          <Typography variant="h6" weight="bold" style={styles.title} numberOfLines={1}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="onSurfaceVariant"
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Typography>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressWrapper}>
          <ProgressBar 
            progress={progress} 
            style={{ marginBottom: scaledSpacing(isSmallScreen ? 4 : 6) }}
          />
          <Typography
            variant="caption"
            color="onSurfaceVariant"
            style={styles.progressText}
          >
            {Math.round(progress * 100)}% Complete
          </Typography>
        </View>
      </View>
    </>
  );

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.container, containerShadow]}
        onPress={async () => {
          try {
            if (id) {
              await addRecentSubject(id);
              console.log(`Subject ${id} added to recent subjects`);
            }
            if (onPress) {
              onPress();
            }
          } catch (error) {
            console.error('Error saving recent subject:', error);
          }
        }}
        onPressIn={() => {
          setIsPressed(true);
          Animated.spring(scaleAnim, {
            toValue: 0.98,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          setIsPressed(false);
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }}
        activeOpacity={1}
      >
        {backgroundImage ? (
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.backgroundImage}
            imageStyle={{
              borderRadius: scaledRadius(theme.roundness * 2),
              opacity: 0.75, // Increased opacity for better image visibility
            }}
            resizeMode="cover"
          >
            <View style={styles.gradientOverlay} />
            <View style={styles.contentContainer}>
              <CardContent />
            </View>
          </ImageBackground>
        ) : (
          <CardContent />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
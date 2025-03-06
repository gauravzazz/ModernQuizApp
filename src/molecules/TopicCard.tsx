import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Dimensions, ImageBackground } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface TopicCardProps {
  title: string;
  userCount: number;
  icon?: string;
  onPress?: () => void;
  style?: any;
  backgroundImage?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  userCount,
  icon,
  onPress,
  style,
  backgroundImage,
}) => {
  const theme = useTheme<AppTheme>();
  const [isPressed, setIsPressed] = React.useState(false);
  const isSmallScreen = SCREEN_WIDTH < 360;
  const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 600;
  
  // Animation values
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  // Setup animations
  useEffect(() => {
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.03,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]);

    const glowSequence = Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false
      }),
      Animated.timing(glowAnim, {
        toValue: 0.6,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false
      })
    ]);

    Animated.parallel([
      Animated.loop(pulseSequence),
      Animated.loop(glowSequence)
    ]).start();

    return () => {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: backgroundImage ? 0 : scaledSpacing(isSmallScreen ? 16 : isMediumScreen ? 18 : 20),
      marginHorizontal: scaledSpacing(8),
      width: moderateScale(isSmallScreen ? 280 : isMediumScreen ? 300 : 320),
      height: moderateScale(isSmallScreen ? 180 : isMediumScreen ? 200 : 220),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.dark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
    },
    gradientBackground: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderRadius: scaledRadius(theme.roundness * 2),
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.dark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)',
      borderRadius: scaledRadius(theme.roundness * 2),
    },
    contentContainer: {
      padding: scaledSpacing(isSmallScreen ? 16 : 20),
      flex: 1,
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      gap: scaledSpacing(12),
      marginBottom: scaledSpacing(isSmallScreen ? 12 : 16),
    },
    icon: {
      width: moderateScale(isSmallScreen ? 40 : 50),
      height: moderateScale(isSmallScreen ? 40 : 50),
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: scaledRadius(theme.roundness),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    iconText: {
      fontSize: scaledFontSize(isSmallScreen ? 24 : 28),
      color: 'white',
    },
    titleContainer: {
      alignItems: 'center',
      gap: scaledSpacing(8),
    },
    title: {
      color: 'white',
      fontSize: scaledFontSize(isSmallScreen ? 10 : isMediumScreen ? 18 : 20),
      fontWeight: '700',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    userCountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingHorizontal: scaledSpacing(12),
      paddingVertical: scaledSpacing(3),
      borderRadius: scaledRadius(20),
      gap: scaledSpacing(4),
    },
    userIcon: {
      fontSize: scaledFontSize(10),
      color: 'white',
    },
    userCountText: {
      color: 'white',
      fontSize: scaledFontSize(11),
      fontWeight: '600',
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: scaledSpacing(isSmallScreen ? 10 : 16),
      marginTop: scaledSpacing(isSmallScreen ? 4 : 6),
    },
    button: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      height: moderateScale(isSmallScreen ? 20: 30),
      borderRadius: scaledRadius(theme.roundness),
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scaledSpacing(16),
      width: '100%',
      maxWidth: moderateScale(isSmallScreen ? 240 : 280),
      alignSelf: 'center',
      paddingBottom : scaledSpacing(4),
    },
    buttonText: {
      color: 'white',
      fontSize: scaledFontSize(isSmallScreen ? 12 : 14),
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

  const containerShadow = {
    shadowColor: theme.colors.neuDark,
    shadowOffset: isPressed
      ? { width: moderateScale(-2), height: moderateScale(-2) }
      : { width: moderateScale(4), height: moderateScale(4) },
    shadowOpacity: isPressed ? 0.2 : 0.3,
    shadowRadius: moderateScale(12),
    elevation: isPressed ? moderateScale(2) : moderateScale(8),
  };

  const CardContent = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        {icon && (
          <View style={styles.icon}>
            <Typography style={styles.iconText}>{icon}</Typography>
          </View>
        )}
        
        <View style={styles.titleContainer}>
          <Typography style={styles.title} numberOfLines={1}>
            {title}
          </Typography>
          
          <View style={styles.userCountContainer}>
            <Typography style={styles.userIcon}>👥</Typography>
            <Typography style={styles.userCountText}>
              {userCount} Active Users
            </Typography>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Typography style={styles.buttonText}>Start Now</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulseAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.container, containerShadow, style]}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.9}
      >
        {backgroundImage ? (
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.backgroundImage}
            imageStyle={{
              borderRadius: scaledRadius(theme.roundness * 2),
              opacity: 1,
            }}
            resizeMode="cover"
          >
            <View style={[styles.gradientOverlay]} />
            <View style={styles.contentContainer}>
              <CardContent />
            </View>
          </ImageBackground>
        ) : (
          <>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
            <CardContent />
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
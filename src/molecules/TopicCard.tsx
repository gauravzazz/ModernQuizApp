import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize, scaledShadow } from '../utils/scaling';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface TopicCardProps {
  title: string;
  userCount: number;
  icon?: string;
  onPress?: () => void;
  style?: any;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  userCount,
  icon,
  onPress,
  style,
}) => {
  const theme = useTheme<AppTheme>();
  const [isPressed, setIsPressed] = React.useState(false);
  const isSmallScreen = SCREEN_WIDTH < 360;
  const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 600;
  
  // Animation values
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Setup pulse animation
  useEffect(() => {
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.02,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]);

    const glowSequence = Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false
      }),
      Animated.timing(glowAnim, {
        toValue: 0.5,
        duration: 2000,
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

  // Base styles
  const styles = StyleSheet.create({
    container: {
      borderRadius: scaledRadius(theme.roundness * 1.5),
      padding: scaledSpacing(isSmallScreen ? 14 : isMediumScreen ? 16 : 18),
      marginRight: scaledSpacing(16),
      width: moderateScale(isSmallScreen ? 260 : isMediumScreen ? 280 : 300),
      height: moderateScale(isSmallScreen ? 170 : isMediumScreen ? 180 : 190),
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
      borderRadius: scaledRadius(theme.roundness * 1.5),
    },
    header: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scaledSpacing(isSmallScreen ? 12 : isMediumScreen ? 16 : 18),
      width: '100%',
    },
    icon: {
      width: moderateScale(isSmallScreen ? 40 : isMediumScreen ? 44 : 48),
      height: moderateScale(isSmallScreen ? 40 : isMediumScreen ? 44 : 48),
      backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: scaledRadius(isSmallScreen ? 12 : 14),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.dark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)',
      marginBottom: scaledSpacing(10),
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scaledSpacing(10),
    },
    userCountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scaledSpacing(4),
    },
    userIcon: {
      fontSize: moderateScale(isSmallScreen ? 14 : 16),
      color: theme.dark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    },
    buttonContainer: {
      marginTop: 'auto',
      paddingTop: scaledSpacing(isSmallScreen ? 10 : isMediumScreen ? 12 : 14),
      width: '100%',
      alignItems: 'center',
    },
    customButton: {
      backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      borderColor: theme.dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)',
      height: moderateScale(isSmallScreen ? 38 : isMediumScreen ? 42 : 46),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scaledSpacing(isSmallScreen ? 10 : isMediumScreen ? 14 : 18),
      borderRadius: scaledRadius(theme.roundness),
    },
    buttonText: {
      color: theme.dark ? 'white' : 'white',
      fontWeight: 'bold',
      fontSize: scaledFontSize(isSmallScreen ? 13 : 14),
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    title: {
      color: theme.dark ? 'white' : 'white',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      fontSize: scaledFontSize(isSmallScreen ? 16 : isMediumScreen ? 18 : 20),
      fontWeight: '700',
      letterSpacing: 0.3,
      textAlign: 'center',
    },
    userCountText: {
      color: theme.dark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      fontSize: scaledFontSize(isSmallScreen ? 12 : 14),
  }});

  // Dynamic shadow styles for neumorphism that adapt to theme
  const containerShadow = {
    shadowColor: theme.colors.neuDark,
    shadowOffset: isPressed
      ? { width: moderateScale(-2), height: moderateScale(-2) }
      : { width: moderateScale(4), height: moderateScale(4) },
    shadowOpacity: isPressed ? 0.2 : 0.3,
    shadowRadius: moderateScale(12),
    elevation: isPressed ? moderateScale(2) : moderateScale(8),
    borderColor: `rgba(${theme.dark ? '255, 255, 255' : '0, 0, 0'}, 0.15)`,
  };

  // Interpolate glow animation
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7]
  });

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
        activeOpacity={1}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary, theme.colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
        
        <View style={styles.header}>
          {icon && (
            <View style={styles.icon}>
              <Typography color="elevation" style={{ fontSize: scaledFontSize(isSmallScreen ? 18 : 20) }}>{icon}</Typography>
            </View>
          )}
          
          <View style={styles.titleContainer}>
            <Typography variant="h6" style={styles.title} numberOfLines={1}>
              {title}
            </Typography>
          </View>
          
          <View style={styles.userCountContainer}>
            <Typography variant="body2" style={styles.userIcon}>
              👥
            </Typography>
            <Typography variant="body2" style={styles.userCountText}>
              {userCount}
            </Typography>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            label="Start Now"
            onPress={onPress}
            variant="neumorphic"
            size="medium"
            fullWidth
            style={[styles.customButton, { transform: [] }]}
          >
            <Typography style={styles.buttonText}>Start Now</Typography>
          </Button>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
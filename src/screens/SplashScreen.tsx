import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeContext } from '../context/ThemeContext';
import { Typography } from '../atoms/Typography';
import { moderateScale } from '../utils/scaling';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onLoadingComplete: () => void;
}

export const SplashScreen = ({ onLoadingComplete }: SplashScreenProps) => {
  const { theme, isDarkMode } = useThemeContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate loading resources
    const loadResources = async () => {
      // Animate logo appearance
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate title appearance with slight delay
      setTimeout(() => {
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 400);

      // Animate subtitle appearance with more delay
      setTimeout(() => {
        Animated.timing(subtitleFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 800);

      // Complete loading after animations
      setTimeout(() => {
        onLoadingComplete();
      }, 2500);
    };

    loadResources();
  }, [fadeAnim, scaleAnim, titleFadeAnim, subtitleFadeAnim, onLoadingComplete]);

  // Get gradient colors based on theme
  const gradientColors = isDarkMode ? ['#1E1B4B', '#121212'] as const : ['#E3F2FD', '#FFFFFF'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.content, ]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              backgroundColor: theme.colors.neuPrimary,
              shadowColor: theme.colors.neuDark,
              shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
              shadowOpacity: 0.25,
              shadowRadius: moderateScale(6),
              elevation: moderateScale(5),
              borderWidth: moderateScale(1),
              borderColor: theme.colors.neuLight
            },
          ]}
        >
          <Image
            source={require('../../assets/splash-icon.png')}
            style={[styles.logo, { tintColor: theme.colors.primary }]}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleFadeAnim,
            },
          ]}
        >
          <Typography
            variant="h1"
            style={[
              styles.title,
              { 
                color: theme.colors.primary,
                textShadowColor: theme.colors.neuDark,
                textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
                textShadowRadius: moderateScale(1)
              }
            ]}
          >
            Modern Quiz
          </Typography>
        </Animated.View>

        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleFadeAnim,
            },
          ]}
        >
          <Typography
            variant="h2"
            style={[
              styles.subtitle,
              { 
                color: theme.colors.onSurfaceVariant,
                textShadowColor: theme.colors.neuDark,
                textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
                textShadowRadius: moderateScale(1)
              }
            ]}
          >
            Learn. Quiz. Master.
          </Typography>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
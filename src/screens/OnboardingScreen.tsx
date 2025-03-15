import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { moderateScale, scaledSpacing, scaledRadius } from '../utils/scaling';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { theme, isDarkMode } = useThemeContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animation values for each slide element
  const imageAnimatedValue = useRef(new Animated.Value(0)).current;
  const titleAnimatedValue = useRef(new Animated.Value(0)).current;
  const descriptionAnimatedValue = useRef(new Animated.Value(0)).current;

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Welcome to Modern Quiz',
      description: 'Your journey to knowledge mastery begins here. Explore a world of quizzes designed to challenge and educate.',
      image: require('../../assets/splash-icon.png'),
    },
    {
      id: '2',
      title: 'Learn Anything, Anytime',
      description: 'Access a wide range of subjects and topics. Study at your own pace with our adaptive learning system.',
      image: require('../../assets/splash-icon.png'),
    },
    {
      id: '3',
      title: 'Track Your Progress',
      description: 'Monitor your performance with detailed analytics. See your improvement over time and identify areas to focus on.',
      image: require('../../assets/splash-icon.png'),
    },
  ];

  useEffect(() => {
    // Animate elements when slide changes
    Animated.sequence([
      Animated.timing(imageAnimatedValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnimatedValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionAnimatedValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      // Reset animation values when component unmounts or slide changes
      imageAnimatedValue.setValue(0);
      titleAnimatedValue.setValue(0);
      descriptionAnimatedValue.setValue(0);
    };
  }, [currentIndex]);

  const handleComplete = async () => {
    try {
      // Mark onboarding as completed in AsyncStorage
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // Reset animation values for the next slide
      imageAnimatedValue.setValue(0);
      titleAnimatedValue.setValue(0);
      descriptionAnimatedValue.setValue(0);
      
      // Move to next slide
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageAnimatedValue,
              transform: [
                {
                  scale: imageAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={item.image}
            style={[styles.image, { tintColor: theme.colors.primary }]}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleAnimatedValue,
              transform: [
                {
                  translateY: titleAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Typography
            variant="h1"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            {item.title}
          </Typography>
        </Animated.View>

        <Animated.View
          style={[
            styles.descriptionContainer,
            {
              opacity: descriptionAnimatedValue,
              transform: [
                {
                  translateY: descriptionAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Typography
            variant="body1"
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            {item.description}
          </Typography>
        </Animated.View>
      </View>
    );
  };

  // Get gradient colors based on theme
  const gradientColors = isDarkMode ? ['#1E1B4B', '#121212'] as const : ['#E3F2FD', '#FFFFFF'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.skipContainer}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity 
            onPress={handleSkip}
            style={[{
              backgroundColor: theme.colors.neuPrimary,
              padding: moderateScale(8),
              borderRadius: theme.roundness,
              shadowColor: theme.colors.neuDark,
              shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
              shadowOpacity: 0.25,
              shadowRadius: moderateScale(4),
              elevation: moderateScale(3),
              borderWidth: moderateScale(1),
              borderColor: theme.colors.neuLight
            }]}
          >
            <Typography
              variant="button"
              style={[styles.skipText, { 
                color: theme.colors.primary,
                textShadowColor: theme.colors.neuDark,
                textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
                textShadowRadius: moderateScale(1)
              }]}
            >
              Skip
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}
        scrollEnabled={false}
        style={styles.flatList}
      />

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: theme.colors.primary,
                  opacity,
                  transform: [{ scale }],
                  shadowColor: theme.colors.neuDark,
                  shadowOffset: { width: moderateScale(1), height: moderateScale(1) },
                  shadowOpacity: 0.25,
                  shadowRadius: moderateScale(2),
                  elevation: moderateScale(2),
                  borderWidth: moderateScale(1),
                  borderColor: theme.colors.neuLight
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          label={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="large"
          fullWidth
          style={styles.button}
        />
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
  skipContainer: {
    position: 'absolute',
    top: moderateScale(50),
    right: moderateScale(20),
    zIndex: 10,
  },
  skipText: {
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledSpacing(20),
  },
  imageContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(40),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: scaledSpacing(20),
  },
  description: {
    textAlign: 'center',
    lineHeight: moderateScale(24),
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(40),
  },
  indicator: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: scaledRadius(5),
    marginHorizontal: scaledSpacing(5),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: scaledSpacing(40),
    marginBottom: moderateScale(50),
  },
  button: {
    borderRadius: scaledRadius(10),
  },
});
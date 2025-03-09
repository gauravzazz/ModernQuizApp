import React, { useRef } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Question } from '../types/quiz';
import { QuizQuestionCard } from './QuizQuestionCard';
import { Typography } from '../atoms/Typography';

interface SwipeableQuestionCardProps {
  question: Question;
  attempt: {
    questionId: string;
    selectedOptionId: string | null;
    isSkipped: boolean;
  };
  index: number;
  isBookmarked?: boolean;
  onBookmark?: (questionId: string) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const SwipeableQuestionCard: React.FC<SwipeableQuestionCardProps> = ({
  question,
  attempt,
  index,
  isBookmarked,
  onBookmark,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const theme = useTheme<AppTheme>();
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-30deg', '0deg', '30deg'],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onSwipeLeft?.();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onSwipeRight?.();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width: SCREEN_WIDTH - 32,
      top: 0,
      left: 0,
    },
    difficultyIndicator: {
      position: 'absolute',
      top: '50%',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: theme.roundness,
      borderWidth: 2,
      transform: [{ translateY: -25 }],
      zIndex: 1000,
    },
    hardIndicator: {
      right: 40,
      borderColor: theme.colors.error,
    },
    easyIndicator: {
      left: 40,
      borderColor: theme.colors.success,
    },
    indicatorText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate: rotation },
    ],
  };

  return (
    <Animated.View style={[styles.container, cardStyle]} {...panResponder.panHandlers}>
      <View
        style={[
          styles.difficultyIndicator,
          styles.hardIndicator,
          { opacity: position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0],
            outputRange: [1, 0],
          })},
        ]}
      >
        <Typography style={[styles.indicatorText, { color: theme.colors.error }]}>HARD</Typography>
      </View>
      <View
        style={[
          styles.difficultyIndicator,
          styles.easyIndicator,
          { opacity: position.x.interpolate({
            inputRange: [0, SCREEN_WIDTH * 1.5],
            outputRange: [0, 1],
          })},
        ]}
      >
        <Typography style={[styles.indicatorText, { color: theme.colors.success }]}>EASY</Typography>
      </View>
      <QuizQuestionCard
        question={question}
        attempt={attempt}
        index={index}
        isBookmarked={isBookmarked}
        onBookmark={onBookmark}
      />
    </Animated.View>
  );
};
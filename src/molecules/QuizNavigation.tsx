import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Button } from '../atoms/Button';
import { NavigationButton } from '../atoms/NavigationButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface QuizNavigationProps {
  mode: 'Practice' | 'Test';
  currentQuestionIndex: number;
  totalQuestions: number;
  onSkip: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  mode,
  currentQuestionIndex,
  totalQuestions,
  onSkip,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 6,
      //paddingTop: 10,
      //paddingBottom: Math.max(insets.bottom, 8),
      backgroundColor: theme.colors.background,
      borderTopWidth: 1.5,
      //borderTopColor: theme.colors.neuLight,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1000
    },
    skipButton: {
      flex: 1,
      marginHorizontal: 8,
      minWidth: 120,
      backgroundColor: theme.colors.neuPrimary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      paddingVertical: 14,
      marginTop: -8
    },
    submitButton: {
      flex: 1,
      marginHorizontal: 8,
      minWidth: 120,
    },
    navigationButton: {
      width: 48,
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.container}>
      {mode === 'Test' && (
        <NavigationButton
          variant="left"
          onPress={onPrevious}
          disabled={currentQuestionIndex === 0}
          style={styles.navigationButton}
        />
      )}
      
      <Button
        label="Skip"
        onPress={onSkip}
        variant="outline"
        style={styles.skipButton}
      />
      
      {mode === 'Test' && (
        <NavigationButton
          variant="right"
          onPress={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          style={styles.navigationButton}
        />
      )}
    </View>
  );
};
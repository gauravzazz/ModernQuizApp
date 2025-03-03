import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { NavigationButton } from '../atoms/NavigationButton';
import { Button } from '../atoms/Button';
import { QuizSummary } from './QuizSummary';

interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  remainingTime: number;
  onClose: () => void;
  onSubmit?: () => void;
  mode: 'Practice' | 'Test';
  questionAttempts: Array<{
    questionId: string;
    selectedOptionId: string | null;
    isSkipped: boolean;
  }>;
  onQuestionSelect?: (index: number) => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestionIndex,
  totalQuestions,
  progress,
  remainingTime,
  onClose,
  onSubmit,
  mode,
  questionAttempts,
  onQuestionSelect,
}) => {
  const theme = useTheme<AppTheme>();
  const [showSummary, setShowSummary] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      zIndex: 1000,
      paddingTop: 8,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neuLight,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      height: 40,
      marginHorizontal: 16,
    },
    timer: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      minWidth: 90,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerText: {
      fontFamily: 'monospace',
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    progressContainer: {
      marginTop: 4,
      paddingHorizontal: 16
    },
    submitButton: {
      height: 40,
      minWidth: 100,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    }
  });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {mode === 'Practice' ? (
          <NavigationButton
            variant="close"
            onPress={onClose}
            size={40}
            style={{
              backgroundColor: theme.colors.neuPrimary,
              borderRadius: theme.roundness,
              shadowColor: theme.colors.neuDark,
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4,
              borderWidth: 1.5,
              borderColor: theme.colors.neuLight
            }}
          />
        ) : (
          <NavigationButton
            variant="menu"
            onPress={() => setShowSummary(true)}
            size={40}
            style={{
              backgroundColor: theme.colors.neuPrimary,
              borderRadius: theme.roundness,
              shadowColor: theme.colors.neuDark,
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4,
              borderWidth: 1.5,
              borderColor: theme.colors.neuLight
            }}
          />
        )}
        <View style={styles.timer}>
          <Typography style={styles.timerText}>
            {formatTime(remainingTime)}
          </Typography>
        </View>
        {onSubmit && (
          <Button
            label="Submit"
            onPress={onSubmit}
            variant="primary"
            style={styles.submitButton}
          />
        )}
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
      </View>

      {mode === 'Test' && (
        <QuizSummary
          visible={showSummary}
          onClose={() => setShowSummary(false)}
          onQuestionSelect={(index) => {
            setShowSummary(false);
            onQuestionSelect?.(index);
          }}
          questions={Array.from({ length: totalQuestions }, (_, index) => {
            const attempt = questionAttempts.find(a => a.questionId === (index + 1).toString());
            return {
              questionNumber: index + 1,
              isSkipped: attempt?.isSkipped || false,
              isAttempted: attempt ? (!attempt.isSkipped && attempt.selectedOptionId !== null) : false,
            };
          })}
        />
      )}
    </View>
  );
};

import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { NavigationButton } from '../atoms/NavigationButton';
import { Button } from '../atoms/Button';
import { QuizSummary } from './QuizSummary';
import { scale, verticalScale, moderateScale, scaledRadius, scaledFontSize } from '../utils/scaling';

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
  const { width: screenWidth } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      zIndex: 100,
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(14),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neuLight,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 0, height: moderateScale(2) },
      shadowOpacity: 0.1,
      shadowRadius: moderateScale(4),
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(12),
      height: verticalScale(48),
      marginHorizontal: scale(16),
    },
    timer: {
      paddingVertical: verticalScale(4),
      paddingHorizontal: scale(screenWidth < 375 ? 12 : 16),
      minWidth: scale(screenWidth < 375 ? 80 : 100),
      height: verticalScale(48),
      alignItems: 'center',
      justifyContent: 'center',
      //backgroundColor: theme.colors.neuPrimary,
      //borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: 4,
      //borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    timerText: {
      fontFamily: 'monospace',
      fontSize: moderateScale(screenWidth < 375 ? 10 : 18),
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    progressContainer: {
      marginTop: verticalScale(4),
      paddingHorizontal: scale(16),
    },
    submitButton: {
      height: verticalScale(45),
      minWidth: scale(screenWidth < 375 ? 30 : 40),
      paddingHorizontal: scale(screenWidth < 375 ? 8 : 10),
      backgroundColor: theme.colors.success,
      borderRadius: scaledRadius(theme.roundness * 2),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(6),
      elevation: 6,
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.success,
    },
    navigationButton: {
      backgroundColor: theme.colors.neuPrimary,
      aspectRatio: 1,
      width: verticalScale(44),
      height: verticalScale(44),
      borderRadius: verticalScale(22),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(8),
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      marginHorizontal: scale(4),
      justifyContent: 'center',
      alignItems: 'center'
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
            size={verticalScale(44)}
            style={styles.navigationButton}
          />
        ) : (
          <NavigationButton
            variant="menu"
            onPress={() => setShowSummary(true)}
            size={verticalScale(44)}
            style={styles.navigationButton}
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

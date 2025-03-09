import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { scale, verticalScale, moderateScale, scaledSpacing, scaledRadius, scaledIconSize, scaledFontSize } from '../utils/scaling';
import { addBookmark, removeBookmark, isQuestionBookmarked } from '../services/bookmarkService';

interface Option {
  id: string;
  text: string;
}

interface QuizQuestionCardProps {
  question: {
    id: string;
    text: string;
    options: Option[];
    correctOptionId: string;
    explanation?: string;
  };
  attempt: {
    questionId: string;
    selectedOptionId: string | null;
    isSkipped: boolean;
  };
  index: number;
  onBookmark?: (questionId: string) => void;
  onDifficultyChange?: (questionId: string, difficulty: 'easy' | 'tough') => void;
  isBookmarked?: boolean;
  difficulty?: 'easy' | 'tough';
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  attempt,
  index,
  onBookmark,
  onDifficultyChange,
  isBookmarked,
  difficulty,
}) => {
  const theme = useTheme<AppTheme>();
  const isSkipped = attempt.isSkipped || attempt.selectedOptionId === null;

  const [showExplanation, setShowExplanation] = React.useState(true);
  const [showFullExplanation, setShowFullExplanation] = React.useState(false);
  const [textHeight, setTextHeight] = React.useState(0);
  const maxHeight = scaledSpacing(24); // Reduced to show approximately 2 lines

  const styles = StyleSheet.create({
    questionCard: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: scaledSpacing(16),
      marginBottom: scaledSpacing(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.6,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(4),
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    questionNumber: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    questionText: {
      marginBottom: scaledSpacing(12),
    },
    optionsContainer: {
      marginTop: scaledSpacing(8),
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scaledSpacing(8),
      paddingHorizontal: scaledSpacing(12),
      marginBottom: scaledSpacing(8),
      borderRadius: theme.roundness,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    optionSelected: {
      backgroundColor: theme.colors.error + '20', // Light red with opacity
      borderColor: theme.colors.error,
    },
    optionCorrect: {
      backgroundColor: theme.colors.success + '20', // Light green with opacity
      borderColor: theme.colors.success,
    },
    optionIndicator: {
      width: moderateScale(24),
      height: moderateScale(24),
      borderRadius: moderateScale(12),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scaledSpacing(12),
      backgroundColor: theme.colors.neuLight,
    },
    optionIndicatorSelected: {
      backgroundColor: theme.colors.error,
    },
    optionIndicatorCorrect: {
      backgroundColor: theme.colors.success,
    },
    optionText: {
      flex: 1,
    },
    skippedBadge: {
      position: 'absolute',
      top: scaledSpacing(8),
      right: scaledSpacing(8),
      backgroundColor: theme.colors.warning,
      paddingHorizontal: scaledSpacing(8),
      paddingVertical: scaledSpacing(4),
      borderRadius: theme.roundness,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scaledSpacing(16),
    },
    actionButton: {
      padding: scaledSpacing(4),
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.background + '80',
    },
    difficultyButtons: {
      flexDirection: 'row',
      gap: scaledSpacing(4),
    },
    difficultyButton: {
      padding: scaledSpacing(4),
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.background + '80',
    },
    selectedDifficultyButton: {
      backgroundColor: theme.colors.primary + '20',
    },
    explanationContainer: {
      marginTop: scaledSpacing(16),
      paddingTop: scaledSpacing(16),
      borderTopWidth: 1,
      borderTopColor: theme.colors.neuLight,
    },
    explanationLabel: {
      color: theme.colors.primary,
      fontWeight: '600',
      marginBottom: scaledSpacing(4),
    },
    explanationText: {
      lineHeight: scaledSpacing(20),
      color: theme.colors.onSurface,
      opacity: 0.87,
      fontSize: scaledFontSize(14),
    },
    showMoreButton: {
      marginTop: scaledSpacing(4),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaledSpacing(4),
    },
    showMoreText: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });



  return (
    <View style={styles.questionCard}>
      {isSkipped && (
        <View style={styles.skippedBadge}>
          <MaterialCommunityIcons name="skip-next" size={scaledIconSize(16)} color="white" />
        </View>
      )}
      
      <Typography variant="body1" style={{marginTop: scaledSpacing(8), marginBottom: scaledSpacing(16)}}>Q{index + 1}. {question.text}</Typography>
      
      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = option.id === attempt.selectedOptionId;
          const isCorrect = option.id === question.correctOptionId;
          return (
            <View
              key={option.id}
              style={[
                styles.optionRow,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
              ]}
            >
              <View
                style={[
                  styles.optionIndicator,
                  isSelected && styles.optionIndicatorSelected,
                  isCorrect && styles.optionIndicatorCorrect,
                ]}
              >
                <Typography color={isSelected || isCorrect ? 'onPrimary' : 'onSurface'}>
                  {String.fromCharCode(65 + question.options.findIndex(o => o.id === option.id))}
                </Typography>
              </View>
              <Typography style={styles.optionText}>{option.text}</Typography>
              <View style={styles.optionsContainer}>
                {isCorrect && (
                  <MaterialCommunityIcons name="check-circle" size={scaledIconSize(20)} color={theme.colors.success} />
                )}
                {isSelected && !isCorrect && (
                  <MaterialCommunityIcons name="close-circle" size={scaledIconSize(20)} color={theme.colors.error} />
                )}
              </View>
            </View>
          );
        })}
      </View>

      {question.explanation && (
        <View style={styles.explanationContainer}>
          <Typography variant="body2" style={styles.explanationLabel}>Explanation:</Typography>
          <View
            style={[!showFullExplanation && { maxHeight }]}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setTextHeight(height);
            }}
          >
            <Typography variant="body2" style={styles.explanationText}>{question.explanation}</Typography>
          </View>
          {textHeight > maxHeight && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowFullExplanation(!showFullExplanation)}
            >
              <Typography variant="body2" style={styles.showMoreText}>
                {showFullExplanation ? 'Show Less' : 'Show More'}
              </Typography>
              <MaterialCommunityIcons
                name={showFullExplanation ? 'chevron-up' : 'chevron-down'}
                size={scaledIconSize(16)}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onBookmark?.(question.id)}
        >
          <MaterialCommunityIcons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={scaledIconSize(20)} 
            color={isBookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant} 
          />
        </TouchableOpacity>
        <View style={styles.difficultyButtons}>
          <TouchableOpacity 
            style={[styles.difficultyButton, difficulty === 'easy' && styles.selectedDifficultyButton]}
            onPress={() => {
              if (difficulty !== 'easy') {
                onDifficultyChange?.(question.id, 'easy');
                Toast.show({
                  type: 'success',
                  text1: 'Difficulty set to Easy',
                  position: 'top',
                  visibilityTime: 2000,
                });
              }
            }}
          >
            <MaterialCommunityIcons 
              name="thumb-up" 
              size={scaledIconSize(20)} 
              color={difficulty === 'easy' ? theme.colors.primary : theme.colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.difficultyButton, difficulty === 'tough' && styles.selectedDifficultyButton]}
            onPress={() => {
              if (difficulty !== 'tough') {
                onDifficultyChange?.(question.id, 'tough');
                Toast.show({
                  type: 'success',
                  text1: 'Difficulty set to Tough',
                  position: 'top',
                  visibilityTime: 2000,
                });
              }
            }}
          >
            <MaterialCommunityIcons 
              name="thumb-down" 
              size={scaledIconSize(20)} 
              color={difficulty === 'tough' ? theme.colors.primary : theme.colors.onSurfaceVariant} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
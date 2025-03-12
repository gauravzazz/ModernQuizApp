import React, { useState } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Button } from '../atoms/Button';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { moderateScale, scaledSpacing, scaledRadius } from '../utils/scaling';

interface Option {
  id: string;
  text: string;
  isHtml?: boolean;
}

interface OptionsGridProps {
  options: Option[];
  selectedOptionId: string | null;
  correctOptionId?: string;
  showCorrectAnswer: boolean;
  onOptionPress: (optionId: string) => void;
  disabled?: boolean;
}

export const OptionsGrid: React.FC<OptionsGridProps> = ({
  options,
  selectedOptionId,
  correctOptionId,
  showCorrectAnswer,
  onOptionPress,
  disabled = false,
}) => {
  const theme = useTheme<AppTheme>();
  const { width } = useWindowDimensions();
  const [pressedOptionId, setPressedOptionId] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      marginTop: scaledSpacing(16),
      paddingHorizontal: scaledSpacing(1),
    },
    optionContainer: {
      marginBottom: scaledSpacing(7),
      width: '100%',
    },
    optionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.6,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
      minHeight: moderateScale(56),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.primary,
      borderRadius: scaledRadius(theme.roundness * 3),
      backgroundColor: theme.colors.neuPrimary,
      transform: [{ scale: 1 }],
      paddingHorizontal: scaledSpacing(12),
      paddingVertical: scaledSpacing(8),
    },
    optionLabel: {
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: scaledSpacing(12),
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(2),
      elevation: moderateScale(2),
    },
    optionLabelText: {
      fontSize: moderateScale(14),
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    optionContent: {
      flex: 1,
      paddingVertical: scaledSpacing(4),
      paddingRight: scaledSpacing(8),
    },
    optionText: {
      color: theme.colors.primary,
      fontWeight: '200',
      padding: scaledSpacing(4),
      textAlign: 'left',
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    selectedOptionText: {
      color: theme.colors.onPrimary,
      fontWeight: '600',
      padding: scaledSpacing(4),
      textAlign: 'left',
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    correctOption: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
      shadowColor: theme.colors.success,
      transform: [{ scale: 1.02 }],
      shadowOpacity: 0.8,
      shadowRadius: moderateScale(8),
    },
    incorrectOption: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
      shadowColor: theme.colors.error,
      transform: [{ scale: 0.98 }],
      shadowOpacity: 0.8,
      shadowRadius: moderateScale(8),
    },
    correctLabel: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
      transform: [{ scale: 1.1 }],
      shadowOpacity: 0.9,
    },
    incorrectLabel: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
      transform: [{ scale: 0.9 }],
      shadowOpacity: 0.9,
    },
    pressedOption: {
      transform: [{ scale: 0.98 }],
      shadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(3),
      elevation: moderateScale(3),
    },
  });

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A = 65 in ASCII
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        const isCorrect = showCorrectAnswer && option.id === correctOptionId;
        const isIncorrect = showCorrectAnswer && isSelected && option.id !== correctOptionId;
        const isPressed = pressedOptionId === option.id;

        return (
          <View key={option.id} style={styles.optionContainer}>
            <Button
              variant="neumorphic"
              style={[
                styles.optionButton,
                isPressed && styles.pressedOption,
                isCorrect && styles.correctOption,
                isIncorrect && styles.incorrectOption,
                isSelected && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                  shadowColor: theme.colors.primary,
                  shadowOpacity: 0.8,
                  shadowRadius: moderateScale(8),
                  transform: [{ scale: 1.02 }]
                }
              ]}
              onPress={() => onOptionPress(option.id)}
              onPressIn={() => setPressedOptionId(option.id)}
              onPressOut={() => setPressedOptionId(null)}
              disabled={disabled || showCorrectAnswer}
            >
              <View
                style={[
                  styles.optionLabel,
                  isCorrect && styles.correctLabel,
                  isIncorrect && styles.incorrectLabel,
                ]}
              >
                <Text style={styles.optionLabelText}>{getOptionLabel(index)}</Text>
              </View>
              <View style={styles.optionContent}>
                {option.isHtml ? (
                  <RenderHtml
                    contentWidth={width - moderateScale(120)}
                    source={{ html: option.text || '' }}
                    baseStyle={{ 
                      color: isSelected ? theme.colors.onPrimary : theme.colors.primary,
                      fontWeight: '600',
                      padding: scaledSpacing(12),
                      fontSize: moderateScale(16)
                    }}
                  />
                ) : (
                  <Text style={isSelected ? styles.selectedOptionText : styles.optionText}>
                    {option.text || ''}
                  </Text>
                )}
              </View>
            </Button>
          </View>
        );
      })}
    </View>
  );
};
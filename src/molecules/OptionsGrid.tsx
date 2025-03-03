import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Button } from '../atoms/Button';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

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
  
  const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      paddingHorizontal: 12,
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      width: '100%',
    },
    optionLabel: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    optionLabelText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    optionButton: {
      flex: 1,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      minHeight: 50,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
    optionContent: {
      flex: 1,
      paddingVertical: 0,
    },
    optionText: {
      color: theme.colors.primary,
      fontWeight: '500',
      padding: 8,
      textAlign: 'left',
    },
    selectedOptionText: {
      color: theme.colors.onPrimary,
      fontWeight: '500',
      padding: 8,
      textAlign: 'left',
    },
    correctOption: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    incorrectOption: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
    },
    correctLabel: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    incorrectLabel: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
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

        return (
          <View key={option.id} style={styles.optionContainer}>
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
              <Button
                variant={isSelected ? 'primary' : 'outline'}
                style={[
                  styles.optionButton,
                  isCorrect && styles.correctOption,
                  isIncorrect && styles.incorrectOption
                ]}
                onPress={() => onOptionPress(option.id)}
                disabled={disabled || showCorrectAnswer}
              >
                {option.isHtml ? (
                  <RenderHtml
                    contentWidth={width - 120}
                    source={{ html: option.text || '' }}
                    baseStyle={{ 
                      color: isSelected ? theme.colors.onPrimary : theme.colors.primary,
                      fontWeight: '500',
                      padding: 8
                    }}
                  />
                ) : (
                  <Text style={isSelected ? styles.selectedOptionText : styles.optionText}>
                    {option.text || ''}
                  </Text>
                )}
              </Button>
            </View>
          </View>
        );
      })}
    </View>
  );
};
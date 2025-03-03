import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import Markdown from 'react-native-markdown-display';
import HTML from 'react-native-render-html';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface QuestionCardProps {
  text: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  text,
  questionNumber,
  totalQuestions,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 24,
      marginHorizontal: 16,
      marginBottom: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      marginTop: 16,
      minHeight: 150,
      maxHeight: 400,
    },
    questionText: {
      marginBottom: 24,
    },
    questionNumber: {
      marginBottom: 8,
      color: theme.colors.onSurfaceVariant,
    },
    selectedOption: {
      backgroundColor: `${theme.colors.primary}20`,
      borderColor: theme.colors.primary,
    },
    correctOption: {
      backgroundColor: '#4BB54320',
      borderColor: '#4BB543',
    },
    incorrectOption: {
      backgroundColor: '#FF4C4C20',
      borderColor: '#FF4C4C',
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.onSurface,
      marginLeft: 12,
    },
    optionIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    correctOptionText: {
      color: '#4BB543',
      fontWeight: '600',
    },
    incorrectOptionText: {
      color: '#FF4C4C',
      fontWeight: '600',
    },
    explanationContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: theme.roundness,
    },
    explanationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    explanationText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.onSurface,
    },
    showMoreButton: {
      marginTop: 8,
      alignSelf: 'flex-start',
    },
    showMoreText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>

      <View style={styles.questionText}>
        {text.includes('<') && text.includes('>') ? (
          <HTML 
            source={{ html: `Q${questionNumber}. ${text}` }}
            contentWidth={SCREEN_WIDTH - 80}
            baseStyle={{
              color: theme.colors.onSurface,
              fontSize: text.length > 200 ? 18 : 20,
              fontWeight: 'bold',
              lineHeight: 28
            }}
          />
        ) : (
          <Markdown
            style={{
              body: {
                color: theme.colors.onSurface,
                fontSize: text.length > 200 ? 18 : 20,
                fontWeight: 'bold',
                lineHeight: 28
              }
            }}
          >
            {`Q${questionNumber}. ${text}`}
          </Markdown>
        )}
      </View>
    </View>
  );
};
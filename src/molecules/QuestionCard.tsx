import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import Markdown from 'react-native-markdown-display';
import HTML from 'react-native-render-html';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

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
      padding: scaledSpacing(24),
      marginHorizontal: scaledSpacing(16),
      marginBottom: scaledSpacing(24),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
      shadowOpacity: theme.dark ? 0.6 : 0.3,
      shadowRadius: moderateScale(theme.dark ? 10 : 8),
      elevation: moderateScale(8),
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      marginTop: scaledSpacing(16),
      minHeight: moderateScale(150),
      maxHeight: moderateScale(400),
    },
    questionText: {
      marginBottom: scaledSpacing(24),
    },
    questionNumber: {
      marginBottom: scaledSpacing(8),
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
      fontSize: scaledFontSize(16),
      color: theme.colors.onSurface,
      marginLeft: scaledSpacing(12),
    },
    optionIndicator: {
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
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
      marginTop: scaledSpacing(16),
      padding: scaledSpacing(16),
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: theme.roundness,
    },
    explanationTitle: {
      fontSize: scaledFontSize(16),
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(8),
    },
    explanationText: {
      fontSize: scaledFontSize(14),
      lineHeight: scaledFontSize(20),
      color: theme.colors.onSurface,
    },
    showMoreButton: {
      marginTop: scaledSpacing(8),
      alignSelf: 'flex-start',
    },
    showMoreText: {
      fontSize: scaledFontSize(14),
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
            contentWidth={SCREEN_WIDTH - moderateScale(80)}
            baseStyle={{
              color: theme.colors.onSurface,
              fontSize: scaledFontSize(text.length > 200 ? 18 : 20),
              fontWeight: 'bold',
              lineHeight: scaledFontSize(28)
            }}
          />
        ) : (
          <Markdown
            style={{
              body: {
                color: theme.colors.onSurface,
                fontSize: scaledFontSize(text.length > 200 ? 18 : 20),
                fontWeight: 'bold',
                lineHeight: scaledFontSize(28)
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
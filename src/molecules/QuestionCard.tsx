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

  const isSmallScreen = SCREEN_WIDTH < 360;
const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 600;

const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2.5),
      padding: scaledSpacing(isSmallScreen ? 10 : isMediumScreen ? 14 : 18),
      marginHorizontal: scaledSpacing(isSmallScreen ? 10 : 1),
      marginBottom: scaledSpacing(isSmallScreen ? 10 : 14),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { 
        width: moderateScale(isSmallScreen ? 4 : 6), 
        height: moderateScale(isSmallScreen ? 4 : 6) 
      },
      shadowOpacity: theme.dark ? 0.6 : 0.3,
      shadowRadius: moderateScale(theme.dark ? 10 : 8),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      marginTop: scaledSpacing(1),
      minHeight: moderateScale(isSmallScreen ? 140 : 170),
      maxHeight: moderateScale(isSmallScreen ? 320 : 420),
      transform: [{ scale: 1 }], // Added for animation base state  
    },
    questionText: {
      marginBottom: scaledSpacing(isSmallScreen ? 1 : 1),
      paddingHorizontal: scaledSpacing(isSmallScreen ? 1 : 1),
      opacity: 1, // Added for fade animation
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

      <View style={[styles.questionText, { alignItems: 'center', justifyContent: 'center' }]}>
        {text.includes('<') && text.includes('>') ? (
          <HTML 
            source={{ html: `Q${questionNumber}. ${text}` }}
            contentWidth={SCREEN_WIDTH - moderateScale(80)}
            baseStyle={{
              color: theme.colors.onSurface,
              fontSize: scaledFontSize(isSmallScreen ? (text.length > 200 ? 10 : 10) : (text.length > 200 ? 10 : 10)),
              fontWeight: '200',
              lineHeight: scaledFontSize(isSmallScreen ? 22 : 28),
              letterSpacing: 0.1,
              textAlign: 'center'
            }}
          />
        ) : (
          <Markdown
            style={{
              body: {
                color: theme.colors.onSurface,
                fontSize: scaledFontSize(isSmallScreen ? (text.length > 200 ? 10: 10) : (text.length > 200 ? 10 : 15)),
                fontWeight: '200',
                lineHeight: scaledFontSize(isSmallScreen ? 22 : 28),
                letterSpacing: 0.1,
                textAlign: 'center'
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
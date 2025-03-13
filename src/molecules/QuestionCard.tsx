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
      justifyContent: 'center', // Add vertical centering
    },
    questionText: {
      marginBottom: scaledSpacing(isSmallScreen ? 1 : 1),
      paddingHorizontal: scaledSpacing(2),
      flex: 1,
      justifyContent: 'center',
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
            contentWidth={SCREEN_WIDTH - moderateScale(100)}
            baseStyle={{
              color: theme.colors.onSurface,
              fontSize: scaledFontSize(
                isSmallScreen ?
                  (text.length < 50 ? 18 : 
                   text.length < 150 ? 16 : 
                   text.length < 300 ? 14 : 12) : 
                  (text.length < 100 ? 20 : 
                   text.length < 250 ? 18 : 
                   text.length < 400 ? 16 : 14)
              ),
              fontWeight: '400',
              lineHeight: scaledFontSize(isSmallScreen ? 22 : 28) * 1.2,
              letterSpacing: 0.3,
              textAlign: 'left',
              paddingVertical: scaledSpacing(8),
            }}
          />
        ) : (
          <Markdown
            style={{
              body: {
                color: theme.colors.onSurface,
                fontSize: scaledFontSize(
                  isSmallScreen ?
                    (text.length < 50 ? 18 : 
                     text.length < 150 ? 16 : 
                     text.length < 300 ? 14 : 12) : 
                    (text.length < 100 ? 20 : 
                     text.length < 250 ? 18 : 
                     text.length < 400 ? 16 : 14)
                ),
                fontWeight: '400',
                lineHeight: scaledFontSize(isSmallScreen ? 22 : 28) * 1.2,
                letterSpacing: 0.3,
                textAlign: 'left',
                paddingVertical: scaledSpacing(8),
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
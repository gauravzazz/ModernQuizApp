import React, { useState } from 'react';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { scale, verticalScale, moderateScale } from '../utils/scaling';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuestionSummary {
  questionNumber: number;
  isSkipped: boolean;
  isAttempted: boolean;
}

interface QuizSummaryProps {
  visible: boolean;
  onClose: () => void;
  onQuestionSelect: (questionIndex: number) => void;
  questions: QuestionSummary[];
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  visible,
  onClose,
  onQuestionSelect,
  questions,
}) => {
  const theme = useTheme<AppTheme>();
  const [activeFilter, setActiveFilter] = useState<'all' | 'not-attempted' | 'attempted' | 'skipped'>('all');
  const [showSkippedOnly, setShowSkippedOnly] = useState(false);

  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 360;
  const isMediumScreen = screenWidth >= 360 && screenWidth < 600;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(20),
    },
    blurOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    fallbackOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '100%',
      backgroundColor: theme.colors.background,
      borderRadius: moderateScale(theme.roundness * 2),
      padding: moderateScale(24),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(8), height: moderateScale(8) },
      shadowOpacity: Platform.OS === 'ios' ? 0.4 : 0.6,
      shadowRadius: moderateScale(12),
      elevation: moderateScale(12),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      maxHeight: '85%',
      transform: [{ scale: isSmallScreen ? 0.95 : 1 }],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(24),
      paddingBottom: verticalScale(12),
      borderBottomWidth: moderateScale(1),
      borderBottomColor: theme.colors.neuLight,
    },
    closeButton: {
      width: moderateScale(36),
      height: moderateScale(36),
      borderRadius: moderateScale(18),
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      transform: [{ scale: 0.95 }],
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: showSkippedOnly ? theme.colors.primary : theme.colors.neuPrimary,
      borderRadius: moderateScale(theme.roundness),
      padding: moderateScale(10),
      marginBottom: verticalScale(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0.4,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
      borderWidth: moderateScale(1.5),
      borderColor: showSkippedOnly ? theme.colors.primary : theme.colors.neuLight,
      transform: [{ scale: showSkippedOnly ? 1.02 : 1 }],
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    questionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: moderateScale(isSmallScreen ? 8 : isMediumScreen ? 10 : 12),
      paddingBottom: verticalScale(16),
      justifyContent: 'center',
    },
    questionButton: {
      width: moderateScale(isSmallScreen ? 40 : isMediumScreen ? 44 : 48),
      height: moderateScale(isSmallScreen ? 40 : isMediumScreen ? 44 : 48),
      borderRadius: moderateScale(theme.roundness),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0.4,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
    },
    legend: {
      flexDirection: isSmallScreen ? 'column' : 'row',
      justifyContent: 'space-around',
      marginBottom: verticalScale(16),
      padding: moderateScale(12),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: moderateScale(theme.roundness),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.3,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
      padding: moderateScale(4),
      marginVertical: isSmallScreen ? verticalScale(4) : 0,
    },
    legendIndicator: {
      width: moderateScale(isSmallScreen ? 14 : 16),
      height: moderateScale(isSmallScreen ? 14 : 16),
      borderRadius: moderateScale(isSmallScreen ? 7 : 8),
      borderWidth: moderateScale(1.5),
    },
  });

  const filteredQuestions = React.useMemo(() => {
    switch (activeFilter) {
      case 'not-attempted':
        return questions.filter(q => !q.isAttempted && !q.isSkipped);
      case 'attempted':
        return questions.filter(q => q.isAttempted);
      case 'skipped':
        return questions.filter(q => q.isSkipped);
      default:
        return questions;
    }
  }, [questions, activeFilter]);

  const getFilterButtonStyle = (status: string) => ({
    backgroundColor:
      activeFilter === (status === 'Not Attempted' ? 'not-attempted' :
        status === 'Attempted' ? 'attempted' :
        status === 'Skipped' ? 'skipped' : 'all')
        ? theme.colors.primary
        : theme.colors.neuPrimary,
    borderColor:
      status === 'Attempted'
        ? theme.colors.success
        : status === 'Skipped'
        ? theme.colors.error
        : theme.colors.neuLight,
    flex: 1,
    marginHorizontal: moderateScale(4),
    transform: [{
      scale: activeFilter === (status === 'Not Attempted' ? 'not-attempted' :
        status === 'Attempted' ? 'attempted' :
        status === 'Skipped' ? 'skipped' : 'all')
        ? 1.02
        : 1
    }]
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            tint="dark"
            intensity={20}
            style={styles.blurOverlay}
          />
        ) : (
          <View style={styles.fallbackOverlay} />
        )}
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Typography variant="h5" weight="bold">
              Quiz Summary
            </Typography>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Typography>×</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            {['Not Attempted', 'Attempted', 'Skipped'].map((status, index) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  getFilterButtonStyle(status)
                ]}
                onPress={() => {
                  const filterType = status === 'Not Attempted' ? 'not-attempted' :
                    status === 'Attempted' ? 'attempted' :
                    status === 'Skipped' ? 'skipped' : 'all';
                  setActiveFilter(filterType);
                }}
              >
                <View style={styles.legendItem}>
                  <MaterialCommunityIcons
                    name={status === 'Attempted' ? 'check-circle' : status === 'Skipped' ? 'skip-next-circle' : 'circle-outline'}
                    size={moderateScale(24)}
                    color={status === 'Attempted'
                      ? theme.colors.success
                      : status === 'Skipped'
                      ? theme.colors.error
                      : theme.colors.neuLight
                    }
                    style={{ marginRight: moderateScale(8) }}
                  />
                  <Typography
                    variant="caption"
                    color={showSkippedOnly && status === 'Skipped' ? 'onPrimary' : 'onSurface'}
                  >
                    {status === 'Not Attempted' 
                      ? questions.filter(q => !q.isAttempted && !q.isSkipped).length
                      : status === 'Attempted'
                      ? questions.filter(q => q.isAttempted).length
                      : questions.filter(q => q.isSkipped).length
                    }
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <ScrollView>
            <View style={styles.questionsGrid}>
              {filteredQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.questionButton,
                    {
                      backgroundColor: question.isSkipped
                        ? theme.colors.error
                        : question.isAttempted
                        ? theme.colors.success
                        : theme.colors.neuPrimary,
                      transform: [{ scale: question.isAttempted || question.isSkipped ? 1.05 : 1 }],
                      borderColor: question.isAttempted 
                        ? theme.colors.success
                        : question.isSkipped
                        ? theme.colors.error
                        : theme.colors.neuLight,
                      borderWidth: question.isAttempted || question.isSkipped ? 2 : 1.5,
                    },
                  ]}
                  onPress={() => {
                    onQuestionSelect(question.questionNumber - 1);
                    onClose();
                  }}
                >
                  <View>
                    <Typography
                      variant="button"
                      color={question.isSkipped || question.isAttempted ? 'onPrimary' : 'onSurface'}
                      weight={question.isAttempted ? "bold" : "normal"}
                      style={{ 
                        fontWeight: question.isAttempted ? 'bold' : 'normal',
                        fontSize: question.isAttempted 
                          ? (isSmallScreen ? 8 : 16)
                          : (isSmallScreen ? 8 : 14)
                      }}
                    >
                      {question.questionNumber}
                    </Typography>
                    {(question.isAttempted || question.isSkipped) && (
                      <MaterialCommunityIcons
                        name={question.isAttempted ? 'check' : 'skip-next'}
                        size={moderateScale(isSmallScreen ? 12 : 16)}
                        color={theme.colors.onPrimary}
                        style={{ position: 'absolute', right: -moderateScale(4), top: -moderateScale(4) }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
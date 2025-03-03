import React, { useState } from 'react';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

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
  const [showSkippedOnly, setShowSkippedOnly] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(true);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness * 2,
      padding: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: showSkippedOnly ? theme.colors.primary : theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 8,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    questionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingBottom: 16,
    },
    questionButton: {
      width: 48,
      height: 48,
      borderRadius: theme.roundness,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
      padding: 8,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
  });

  const filteredQuestions = showSkippedOnly
    ? questions.filter(q => q.isSkipped)
    : questions;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
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
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowSkippedOnly(!showSkippedOnly)}
            >
              <Typography
                variant="button"
                color={showSkippedOnly ? 'onPrimary' : 'onSurface'}
              >
                {showSkippedOnly ? 'Showing Skipped' : 'Show Skipped Only'}
              </Typography>
            </TouchableOpacity>
          </View>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.colors.neuPrimary, borderColor: theme.colors.neuLight }]} />
              <Typography variant="caption">Not Attempted</Typography>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.colors.success, borderColor: theme.colors.success }]} />
              <Typography variant="caption">Attempted</Typography>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.colors.error, borderColor: theme.colors.error }]} />
              <Typography variant="caption">Skipped</Typography>
            </View>
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
                  <Typography
                    variant="button"
                    color={question.isSkipped || question.isAttempted ? 'onPrimary' : 'onSurface'}
                    weight={question.isAttempted ? "bold" : "normal"}
                    style={{ 
                      fontWeight: question.isAttempted ? 'bold' : 'normal',
                      fontSize: question.isAttempted ? 16 : 14
                    }}
                  >
                    {question.questionNumber}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
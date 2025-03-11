import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { Slider } from './Slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

interface QuizConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onStart?: (config: { questionCount: number; mode: 'Practice' | 'Test' }) => void;
  initialQuestionCount?: number;
  initialMode?: 'Practice' | 'Test';
  title: string;
  questionCount: number;
  topicId?: string;
  subjectId?: string;
}

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  visible,
  onClose,
  onStart,
  initialQuestionCount = 5,
  initialMode = 'Practice',
  title = 'Configure Quiz',
  questionCount,
  topicId,
  subjectId,
}) => {
  const theme = useTheme<AppTheme>();
  const [selectedQuestionCount, setSelectedQuestionCount] = React.useState(initialQuestionCount);
  const [quizMode, setQuizMode] = React.useState<'Practice' | 'Test'>(initialMode);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      zIndex: 1,
    },
    blurOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: -1,
    },
    fallbackOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: -1,
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
    },
    modalTitle: {
      marginBottom: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    questionCount: {
      marginBottom: 24,
    },
    sliderContainer: {
      marginTop: 12,
      paddingHorizontal: 8,
    },
    slider: {
      width: '100%',
    },
    modeContainer: {
      marginBottom: 24,
    },
    modeButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    modeButton: {
      flex: 1,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 16,
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    activeModeButton: {
      backgroundColor: theme.colors.primary,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness,
      padding: 16,
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
  });

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleStart = () => {
    // Call the onStart callback if provided
    onStart?.({ questionCount: selectedQuestionCount, mode: quizMode });
    
    // Navigate to the Quiz screen through the MainStack navigator
    navigation.navigate('MainStack', {
      screen: 'Quiz',
      params: {
        questionCount: selectedQuestionCount,
        mode: quizMode,
        topicId,
        subjectId
      }
    });
    
    // Log the navigation parameters for debugging
    console.log('[QuizConfigModal] Navigating to Quiz with params:', {
      questionCount: selectedQuestionCount,
      mode: quizMode,
      topicId,
      subjectId
    });
    
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            tint="dark"
            intensity={80}
            style={styles.blurOverlay}
          />
        ) : (
          <View style={styles.fallbackOverlay} />
        )}
        <View style={styles.modalContent}>
          <View style={styles.modalTitle}>
            <Typography variant="h5" weight="bold">
              {title}
            </Typography>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Typography>×</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.questionCount}>
            <Typography variant="h6" weight="medium">
              Number of Questions: {selectedQuestionCount}
            </Typography>
            <View style={styles.sliderContainer}>
              <Slider
                value={selectedQuestionCount}
                onValueChange={setSelectedQuestionCount}
                min={1}
                max={questionCount}
                step={1}
                style={styles.slider}
              />
            </View>
          </View>

          <View style={styles.modeContainer}>
            <Typography variant="h6" weight="medium">
              Select Mode:
            </Typography>
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[styles.modeButton, quizMode === 'Practice' && styles.activeModeButton]}
                onPress={() => setQuizMode('Practice')}
              >
                <Typography
                  variant="button"
                  color={quizMode === 'Practice' ? 'onPrimary' : 'onSurface'}
                >
                  Practice
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, quizMode === 'Test' && styles.activeModeButton]}
                onPress={() => setQuizMode('Test')}
              >
                <Typography
                  variant="button"
                  color={quizMode === 'Test' ? 'onPrimary' : 'onSurface'}
                >
                  Test
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Typography variant="button" color="onPrimary">
              Start Quiz
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { XpProgressBar } from './XpProgressBar';
import { LevelUpNotification } from './LevelUpNotification';
import { ScoreDisplay } from './ScoreDisplay';
import { ModalContainer, useModalAnimations } from './ModalContainer';
import { scale, verticalScale, scaledSpacing, moderateScale } from '../utils/scaling';

interface QuizCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  xpData: {
    oldXP: number;
    newXP: number;
    xpGained: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
  };
  score?: {
    points: number;
    total: number;
    percentage: number;
  };
}

export const QuizCompletionModal: React.FC<QuizCompletionModalProps> = ({
  visible,
  onClose,
  xpData,
  score,
}) => {
  const theme = useTheme<AppTheme>();
  const { modalScaleAnim, modalOpacityAnim } = useModalAnimations();
  
  const styles = StyleSheet.create({
    titleContainer: {
      marginBottom: scaledSpacing(24),
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: theme.colors.primary,
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
      letterSpacing: 0.5,
    },
    buttonContainer: {
      marginTop: scaledSpacing(24),
      width: '100%',
    },
    button: {
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(24),
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      {/* Title section */}
      <View style={styles.titleContainer}>
        <Typography variant="h2" style={styles.title}>Quiz Completed!</Typography>
      </View>
      
      {/* Score section */}
      {score && (
        <ScoreDisplay 
          score={score} 
          modalScaleAnim={modalScaleAnim} 
          modalOpacityAnim={modalOpacityAnim} 
        />
      )}
      
      {/* XP progress bar */}
      <XpProgressBar 
        oldXP={xpData.oldXP}
        newXP={xpData.newXP}
        xpGained={xpData.xpGained}
        visible={visible}
      />
      
      {/* Level up notification */}
      <LevelUpNotification 
        visible={visible}
        leveledUp={xpData.leveledUp}
        newLevel={xpData.newLevel}
      />
      
      {/* Continue button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={onClose}
        >
          <Typography variant="button" style={styles.buttonText}>Continue</Typography>
        </TouchableOpacity>
      </View>
    </ModalContainer>
  );
};
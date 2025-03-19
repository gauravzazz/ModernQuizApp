import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Modal, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { Confetti } from '../atoms/ConfettiCannon';
import { UserAward } from '../types/profile';
import { moderateScale, scale, verticalScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

interface QuizCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onViewFullResults: () => void;
  score: {
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  };
  xpData: {
    oldXP: number;
    newXP: number;
    xpGained: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
  };
  unlockedAwards: UserAward[];
}

export const QuizCompletionModal: React.FC<QuizCompletionModalProps> = ({
  visible,
  onClose,
  onViewFullResults,
  score,
  xpData,
  unlockedAwards,
}) => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth } = Dimensions.get('window');
  
  // Determine screen size for responsive design
  const isSmallScreen = screenWidth < 360;
  const isMediumScreen = screenWidth >= 360 && screenWidth < 600;
  
  // Animation values
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;
  const xpNumberAnim = useRef(new Animated.Value(xpData.oldXP)).current;
  const levelAnim = useRef(new Animated.Value(0)).current;
  const levelNumberAnim = useRef(new Animated.Value(xpData.oldLevel)).current;
  const awardAnim = useRef(new Animated.Value(0)).current;
  
  // State for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Run animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      modalScaleAnim.setValue(0.8);
      modalOpacityAnim.setValue(0);
      scoreAnim.setValue(0);
      xpAnim.setValue(0);
      xpNumberAnim.setValue(xpData.oldXP);
      levelAnim.setValue(0);
      levelNumberAnim.setValue(xpData.oldLevel);
      awardAnim.setValue(0);
      
      // Animate modal entrance
      Animated.parallel([
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
      // Sequence of animations
      Animated.sequence([
        // 1. Show score
        Animated.timing(scoreAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        
        // 2. Show XP section
        Animated.timing(xpAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        
        // 3. Animate XP increase
        Animated.timing(xpNumberAnim, {
          toValue: xpData.newXP,
          duration: 1500,
          useNativeDriver: false,
        }),
        
        // 4. Show level up if applicable
        Animated.timing(levelAnim, {
          toValue: xpData.leveledUp ? 1 : 0,
          duration: 500,
          useNativeDriver: true,
        }),
        
        // 5. Animate level number if leveled up
        Animated.timing(levelNumberAnim, {
          toValue: xpData.newLevel,
          duration: xpData.leveledUp ? 800 : 0,
          useNativeDriver: false,
        }),
        
        // 6. Show awards if any
        Animated.timing(awardAnim, {
          toValue: unlockedAwards.length > 0 ? 1 : 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Show confetti after all animations complete
        if (xpData.leveledUp || unlockedAwards.length > 0) {
          setShowConfetti(true);
        }
      });
    } else {
      setShowConfetti(false);
    }
  }, [visible, xpData, unlockedAwards.length]);
  
  // Format XP number for display
  const formattedXP = xpNumberAnim.interpolate({
    inputRange: [xpData.oldXP, xpData.newXP],
    outputRange: [xpData.oldXP.toString(), xpData.newXP.toString()],
    extrapolate: 'clamp'
  });
  
  // Format level number for display
  const formattedLevel = levelNumberAnim.interpolate({
    inputRange: [xpData.oldLevel, xpData.newLevel],
    outputRange: [xpData.oldLevel.toString(), xpData.newLevel.toString()],
    extrapolate: 'clamp'
  });
  
  // Calculate dimensions based on screen size
  const modalWidth = isSmallScreen ? '95%' : isMediumScreen ? '90%' : '85%';
  const maxModalWidth = isSmallScreen ? 320 : isMediumScreen ? 400 : 450;
  const titleFontSize = isSmallScreen ? scaledFontSize(20) : scaledFontSize(24);
  const scoreFontSize = isSmallScreen ? scaledFontSize(36) : scaledFontSize(48);
  const xpFontSize = isSmallScreen ? scaledFontSize(28) : scaledFontSize(32);
  const levelFontSize = isSmallScreen ? scaledFontSize(24) : scaledFontSize(28);
  const modalPadding = scaledSpacing(isSmallScreen ? 20 : 28);
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: scaledSpacing(16),
    },
    modalContent: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: modalPadding,
      width: modalWidth,
      maxWidth: maxModalWidth,
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
      shadowOpacity: 0.8,
      shadowRadius: moderateScale(10),
      elevation: moderateScale(10),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      overflow: 'hidden',
    },
    modalBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.08,
    },
    titleContainer: {
      marginBottom: scaledSpacing(24),
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: titleFontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
      letterSpacing: 0.5,
    },
    scoreContainer: {
      alignItems: 'center',
      marginBottom: scaledSpacing(24),
      width: '100%',
    },
    scoreValue: {
      fontSize: scoreFontSize,
      fontWeight: 'bold',
      color: getScoreColor(score.percentage),
      marginBottom: scaledSpacing(8),
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    scoreLabel: {
      fontSize: scaledFontSize(16),
      color: theme.colors.onSurfaceVariant,
      marginBottom: scaledSpacing(4),
    },
    xpContainer: {
      alignItems: 'center',
      marginBottom: scaledSpacing(24),
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: scaledRadius(theme.roundness),
      padding: scaledSpacing(16),
    },
    xpRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scaledSpacing(8),
    },
    xpIcon: {
      marginRight: scaledSpacing(8),
      color: theme.colors.primary,
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    xpValue: {
      fontSize: xpFontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    xpGained: {
      fontSize: scaledFontSize(16),
      color: theme.colors.success,
      fontWeight: 'bold',
    },
    levelContainer: {
      alignItems: 'center',
      marginBottom: scaledSpacing(24),
      width: '100%',
    },
    levelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scaledSpacing(8),
    },
    levelIcon: {
      marginRight: scaledSpacing(8),
      color: theme.colors.success,
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    levelValue: {
      fontSize: levelFontSize,
      fontWeight: 'bold',
      color: theme.colors.success,
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    levelUpText: {
      fontSize: scaledFontSize(18),
      fontWeight: 'bold',
      color: theme.colors.success,
      marginBottom: scaledSpacing(8),
    },
    awardsContainer: {
      alignItems: 'center',
      marginBottom: scaledSpacing(24),
      width: '100%',
    },
    awardsTitle: {
      fontSize: scaledFontSize(18),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(16),
      textAlign: 'center',
    },
    awardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: scaledRadius(theme.roundness),
      padding: scaledSpacing(12),
      marginBottom: scaledSpacing(8),
      width: '100%',
    },
    awardIcon: {
      fontSize: scaledFontSize(24),
      marginRight: scaledSpacing(12),
    },
    awardTextContainer: {
      flex: 1,
    },
    awardName: {
      fontSize: scaledFontSize(16),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(2),
    },
    awardDescription: {
      fontSize: scaledFontSize(12),
      color: theme.colors.onSurfaceVariant,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: scaledSpacing(8),
    },
    button: {
      flex: 1,
      marginHorizontal: scaledSpacing(4),
    },
  });

  // Helper function to get color based on score percentage
  function getScoreColor(percentage: number): string {
    if (percentage >= 90) return theme.colors.success;
    if (percentage >= 70) return theme.colors.primary;
    if (percentage >= 50) return theme.colors.warning || '#FF9800';
    return theme.colors.error;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {showConfetti && (
          <Confetti
            count={100}
            origin={{ x: screenWidth / 2, y: 0 }}
            fallSpeed={2000}
            fadeOut={true}
          />
        )}
        
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ scale: modalScaleAnim }],
              opacity: modalOpacityAnim
            }
          ]}
        >
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.modalBackground}
          />
          
          <View style={styles.titleContainer}>
            <Typography variant="h5" weight="bold" style={styles.title}>
              Quiz Completed!
            </Typography>
          </View>
          
          {/* Score Section */}
          <Animated.View 
            style={[styles.scoreContainer, {
              opacity: scoreAnim,
              transform: [{
                translateY: scoreAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }]}
          >
            <Typography style={styles.scoreLabel}>
              Your Score
            </Typography>
            <Typography style={styles.scoreValue}>
              {score.percentage.toFixed(0)}%
            </Typography>
            <Typography style={styles.scoreLabel}>
              {score.correctAnswers} / {score.totalQuestions} correct answers
            </Typography>
          </Animated.View>
          
          {/* XP Section */}
          <Animated.View 
            style={[styles.xpContainer, {
              opacity: xpAnim,
              transform: [{
                translateY: xpAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }]}
          >
            <View style={styles.xpRow}>
              <MaterialCommunityIcons 
                name="star" 
                size={moderateScale(28)} 
                style={styles.xpIcon} 
              />
              <Animated.Text style={styles.xpValue}>
                {formattedXP}
              </Animated.Text>
              <Typography style={styles.xpGained}>
                {' '}+{xpData.xpGained}
              </Typography>
            </View>
            <Typography style={styles.scoreLabel}>
              Experience Points
            </Typography>
          </Animated.View>
          
          {/* Level Up Section */}
          {xpData.leveledUp && (
            <Animated.View 
              style={[styles.levelContainer, {
                opacity: levelAnim,
                transform: [{
                  scale: levelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }]}
            >
              <Typography style={styles.levelUpText}>
                🎉 Level Up! 🎉
              </Typography>
              <View style={styles.levelRow}>
                <MaterialCommunityIcons 
                  name="trophy" 
                  size={moderateScale(24)} 
                  style={styles.levelIcon} 
                />
                <Typography style={styles.levelValue}>
                  Level {formattedLevel}
                </Typography>
              </View>
            </Animated.View>
          )}
          
          {/* Awards Section */}
          {unlockedAwards.length > 0 && (
            <Animated.View 
              style={[styles.awardsContainer, {
                opacity: awardAnim,
                transform: [{
                  translateY: awardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }]}
            >
              <Typography style={styles.awardsTitle}>
                {unlockedAwards.length === 1 ? 'Achievement Unlocked!' : 'Achievements Unlocked!'}
              </Typography>
              
              {unlockedAwards.map((award, index) => (
                <Animated.View 
                  key={award.id}
                  style={[styles.awardRow, {
                    opacity: awardAnim,
                    transform: [{
                      translateX: awardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })
                    }]
                  }]}
                >
                  <Typography style={styles.awardIcon}>{award.icon}</Typography>
                  <View style={styles.awardTextContainer}>
                    <Typography style={styles.awardName}>{award.name}</Typography>
                    <Typography style={styles.awardDescription}>{award.description}</Typography>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          )}
          
          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Button
              label="Close"
              onPress={onClose}
              variant="secondary"
              style={styles.button}
            />
            <Button
              label="View Full Results"
              onPress={onViewFullResults}
              style={styles.button}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
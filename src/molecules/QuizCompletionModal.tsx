import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Modal, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Confetti } from '../atoms/ConfettiCannon';
import { moderateScale, scale, verticalScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

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
  const { width: screenWidth } = Dimensions.get('window');
  
  // Determine screen size for responsive design
  const isSmallScreen = screenWidth < 360;
  const isMediumScreen = screenWidth >= 360 && screenWidth < 600;
  
  // Animation values
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const xpBarAnim = useRef(new Animated.Value(0)).current;
  const xpNumberAnim = useRef(new Animated.Value(0)).current;
  const levelUpAnim = useRef(new Animated.Value(0)).current;
  
  // Sparkle animation control
  const [showSparkles, setShowSparkles] = useState(false);
  const sparkleOrigins = useRef<Array<{x: number, y: number}>>([]);
  
  // Calculate XP progress percentages
  const levelXpRequired = 100; // XP required per level (from xpService.ts)
  const oldLevelProgress = (xpData.oldXP % levelXpRequired) / levelXpRequired;
  const newLevelProgress = (xpData.newXP % levelXpRequired) / levelXpRequired;
  
  // Run animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      modalScaleAnim.setValue(0.8);
      modalOpacityAnim.setValue(0);
      xpBarAnim.setValue(0);
      xpNumberAnim.setValue(0);
      levelUpAnim.setValue(0);
      setShowSparkles(false);
      
      // Generate random sparkle origins along the XP bar
      const numSparkles = 5;
      const newSparkleOrigins = [];
      for (let i = 0; i < numSparkles; i++) {
        // Position sparkles along the progress bar
        const xPos = 50 + (i * 40); // Distribute horizontally
        const yPos = 0; // At the top of the progress bar
        newSparkleOrigins.push({ x: xPos, y: yPos });
      }
      sparkleOrigins.current = newSparkleOrigins;
      
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
      
      // Animate XP bar after modal appears
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(xpBarAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        })
      ]).start(() => {
        // Trigger sparkles when XP bar animation completes
        setShowSparkles(true);
        
        // Hide sparkles after a delay
        setTimeout(() => {
          setShowSparkles(false);
        }, 2000);
      });
      
      // Animate XP number counting up
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(xpNumberAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        })
      ]).start();
      
      // Animate level up notification if applicable
      if (xpData.leveledUp) {
        Animated.sequence([
          Animated.delay(1500),
          Animated.spring(levelUpAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          })
        ]).start();
      }
      
      // No awards animation needed anymore
    }
  }, [visible, xpData.leveledUp]);
  
  // Calculate dimensions based on screen size
  const modalWidth = isSmallScreen ? '95%' : isMediumScreen ? '90%' : '85%';
  const maxModalWidth = isSmallScreen ? 320 : isMediumScreen ? 400 : 450;
  const titleFontSize = isSmallScreen ? scaledFontSize(20) : scaledFontSize(24);
  const subtitleFontSize = isSmallScreen ? scaledFontSize(16) : scaledFontSize(18);
  const modalPadding = scaledSpacing(isSmallScreen ? 20 : 28);
  
  // Interpolate XP bar width for partial progress
  const xpBarWidth = xpBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${oldLevelProgress * 100}%`, `${newLevelProgress * 100}%`],
  });
  
  // Interpolate old XP bar width (always visible)
  const oldXpBarWidth = `${oldLevelProgress * 100}%`;
  
  // Interpolate XP number
  const displayedXP = xpNumberAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [xpData.oldXP, xpData.newXP],
  });
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaledSpacing(16),
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
      backgroundColor: 'rgba(0,0,0,0.7)',
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
    closeButton: {
      position: 'absolute',
      top: scaledSpacing(12),
      right: scaledSpacing(12),
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.6,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
      zIndex: 10,
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
    subtitle: {
      textAlign: 'center',
      fontSize: subtitleFontSize,
      marginTop: scaledSpacing(8),
      color: theme.colors.onSurfaceVariant,
      opacity: 0.9,
    },
    xpContainer: {
      width: '100%',
      marginBottom: scaledSpacing(24),
      alignItems: 'center',
    },
    xpLabel: {
      fontSize: scaledFontSize(16),
      marginBottom: scaledSpacing(8),
      color: theme.colors.onSurface,
    },
    xpValue: {
      fontSize: scaledFontSize(24),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(16),
    },
    xpBarContainer: {
      width: '100%',
      height: moderateScale(20),
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      position: 'relative',
    },
    xpBar: {
      height: '100%',
      borderRadius: scaledRadius(theme.roundness),
      position: 'absolute',
      left: 0,
      top: 0,
    },
    newXpBar: {
      zIndex: 2,
    },
    sparkleContainer: {
      position: 'absolute',
      top: -moderateScale(30),
      height: moderateScale(60),
      width: moderateScale(30),
      zIndex: 10,
      pointerEvents: 'none',
    },
    levelUpContainer: {
      marginTop: scaledSpacing(24),
      marginBottom: scaledSpacing(24),
      padding: scaledSpacing(16),
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness),
      width: '100%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    levelUpText: {
      fontSize: scaledFontSize(18),
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    levelUpValue: {
      fontSize: scaledFontSize(32),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: scaledSpacing(8),
    },
    // Awards styles removed
    scoreContainer: {
      width: '100%',
      marginTop: scaledSpacing(16),
      marginBottom: scaledSpacing(16),
      padding: scaledSpacing(20),
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness),
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(6),
    },
    scoreTitle: {
      fontSize: scaledFontSize(20),
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: scaledSpacing(12),
    },
    scoreValue: {
      fontSize: scaledFontSize(38),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(8),
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
    },
    scorePercentage: {
      fontSize: scaledFontSize(18),
      color: theme.colors.onSurfaceVariant,
      fontWeight: '600',
    },
    buttonContainer: {
      marginTop: scaledSpacing(24),
      width: '100%',
    },
    button: {
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(24),
      borderRadius: scaledRadius(theme.roundness),
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
      fontSize: scaledFontSize(16),
      fontWeight: 'bold',
    },
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
        
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: modalScaleAnim }],
              opacity: modalOpacityAnim,
            },
          ]}
        >
          {/* Background pattern */}
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0)']} 
            style={styles.modalBackground}
          />
          
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={18} color={theme.colors.onSurface} />
          </TouchableOpacity>
          
          {/* Title section */}
          <View style={styles.titleContainer}>
            <Typography variant="h2" style={styles.title}>Quiz Completed!</Typography>
          </View>
          
          {/* Score section - Moved to top */}
          {score && (
            <Animated.View 
              style={[styles.scoreContainer, {
                transform: [{ scale: modalScaleAnim }],
                opacity: modalOpacityAnim,
                marginTop: 0,
                marginBottom: scaledSpacing(24)
              }]}
            >
              <Typography variant="h3" style={styles.scoreTitle}>Your Score</Typography>
              <Typography variant="h1" style={styles.scoreValue}>
                {score.points}/{score.total}
              </Typography>
              <Typography variant="body1" style={styles.scorePercentage}>
                {score.percentage}% Correct
              </Typography>
            </Animated.View>
          )}
          
          {/* XP section */}
          <View style={styles.xpContainer}>
            <Typography variant="body1" style={styles.xpLabel}>Experience Points</Typography>
            <Animated.Text style={styles.xpValue}>
              {displayedXP.interpolate({
                inputRange: [0, 1],
                outputRange: [xpData.oldXP.toString(), xpData.newXP.toString()]
              })}
              <Typography variant="body2" style={{ color: theme.colors.success }}> (+{xpData.xpGained})</Typography>
            </Animated.Text>
            
            <View style={styles.xpBarContainer}>
              {/* Old XP progress (always visible) */}
              <View style={[styles.xpBar, { width: oldXpBarWidth }]}>
                <LinearGradient
                  colors={[theme.colors.neuLight, theme.colors.neuPrimary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </View>
              
              {/* New XP progress (animates from old to new) */}
              <Animated.View 
                style={[
                  styles.xpBar, 
                  styles.newXpBar, 
                  { width: xpBarWidth }
                ]}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
              
              {/* Sparkle effects */}
              {showSparkles && sparkleOrigins.current.map((origin, index) => (
                <View key={index} style={[styles.sparkleContainer, { left: `${origin.x}%` }]}>
                  <Confetti
                    count={15}
                    origin={{ x: 0, y: 0 }}
                    fallSpeed={1500}
                    explosionSpeed={200}
                    colors={[theme.colors.primary, theme.colors.secondary, '#FFC107', '#FFFFFF']}
                    fadeOut={true}
                  />
                </View>
              ))}
            </View>
          </View>
          
          {/* Level up notification */}
          {xpData.leveledUp && (
            <Animated.View 
              style={[styles.levelUpContainer, {
                transform: [{ scale: levelUpAnim }],
                opacity: levelUpAnim
              }]}
            >
              <MaterialCommunityIcons 
                name="star-circle" 
                size={moderateScale(40)} 
                color={theme.colors.primary} 
              />
              <Typography variant="h3" style={styles.levelUpText}>Level Up!</Typography>
              <Typography variant="h1" style={styles.levelUpValue}>
                {xpData.newLevel}
              </Typography>
            </Animated.View>
          )}
          
          {/* Awards section removed */}
          
          {/* Score section moved to top */}
          
          {/* Continue button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={onClose}
            >
              <Typography variant="button" style={styles.buttonText}>Continue</Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
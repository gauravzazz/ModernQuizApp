import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Modal, Dimensions, Animated, Easing, TouchableOpacity, Platform } from 'react-native';
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
  const sparkleOrigins = useRef<Array<{x: number, y: number, delay: number}>>([]);
  const sparkleAnimations = useRef<Animated.Value[]>([]).current;
  
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
      
      // Generate sparkle origins along the gained XP section
      const numSparkles = 8; // Increased number of sparkles
      const newSparkleOrigins = [];
      const gainStart = oldLevelProgress * 100;
      const gainWidth = (newLevelProgress - oldLevelProgress) * 100;
      
      // Reset sparkle animations
      sparkleAnimations.length = 0;
      
      for (let i = 0; i < numSparkles; i++) {
        // Position sparkles along the gained XP section with slight randomness
        const xPos = gainStart + (gainWidth * (i / (numSparkles - 1 || 1)));
        // Add slight vertical variation
        const yPos = Math.random() * 10 - 5; // Random position between -5 and 5
        // Add staggered delay for each sparkle
        const delay = i * 100; // Staggered delay in ms
        newSparkleOrigins.push({ x: xPos, y: yPos, delay });
        
        // Create animation value for each sparkle
        sparkleAnimations.push(new Animated.Value(0));
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
          duration: 1500, // Slightly longer duration for smoother animation
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic), // Add easing for more natural animation
        })
      ]).start(() => {
        // Trigger sparkles when XP bar animation completes
        setShowSparkles(true);
        
        // Animate each sparkle with staggered timing
        sparkleAnimations.forEach((anim, index) => {
          const delay = sparkleOrigins.current[index]?.delay || 0;
          
          Animated.sequence([
            Animated.delay(delay),
            Animated.spring(anim, {
              toValue: 1,
              friction: 6,
              tension: 40,
              useNativeDriver: true,
            })
          ]).start();
        });
        
        // Hide sparkles after a delay
        setTimeout(() => {
          setShowSparkles(false);
          // Reset sparkle animations
          sparkleAnimations.forEach(anim => anim.setValue(0));
        }, 3000); // Longer display time
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
  const modalWidth = isSmallScreen ? '95%' : isMediumScreen ? '98%' : '85%';
  const maxModalWidth = isSmallScreen ? 320 : isMediumScreen ? 400 : 450;
  const titleFontSize = isSmallScreen ? scaledFontSize(10) : scaledFontSize(14);
  const subtitleFontSize = isSmallScreen ? scaledFontSize(8) : scaledFontSize(10);
  const modalPadding = scaledSpacing(isSmallScreen ? 10 : 18);
  
  // Interpolate XP bar width for partial progress
  const xpBarWidth = xpBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${oldLevelProgress * 100}%`, `${newLevelProgress * 100}%`],
  });
  
  // Calculate the gained XP width as a percentage
  const gainedXpWidth = `${(newLevelProgress - oldLevelProgress) * 100}%`;
  
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
      borderRadius: scaledRadius(theme.roundness),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      position: 'relative',
    },
    xpBarBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.background,
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
    xpGainedIndicator: {
      height: '100%',
      position: 'absolute',
      top: 0,
      zIndex: 3,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: theme.colors.background,
    },
    sparkleContainer: {
      position: 'absolute',
      top: -moderateScale(30),
      height: moderateScale(60),
      width: moderateScale(30),
      zIndex: 10,
      pointerEvents: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      // transform moved to individual sparkle views for animation
    },
    levelUpContainer: {
      marginTop: scaledSpacing(2),
      marginBottom: scaledSpacing(2),
      padding: scaledSpacing(10),
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness),
      width: '50%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    levelUpText: {
      fontSize: scaledFontSize(10),
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    levelUpValue: {
      fontSize: scaledFontSize(12),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: scaledSpacing(8),
    },
    // Awards styles removed
    scoreContainer: {
      width: '90%',
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
      fontSize: scaledFontSize(16),
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: scaledSpacing(12),
    },
    scoreValue: {
      fontSize: scaledFontSize(28),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scaledSpacing(8),
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
    },
    scorePercentage: {
      fontSize: scaledFontSize(10),
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
            intensity={90}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Animated.Text style={styles.xpValue}>
                {displayedXP.interpolate({
                  inputRange: [0, 1],
                  outputRange: [xpData.oldXP.toString(), xpData.newXP.toString()]
                })}
              </Animated.Text>
              <Typography variant="body2" style={{ color: theme.colors.success, marginLeft: 4 }}> (+{xpData.xpGained})</Typography>
            </View>
            
            <View style={styles.xpBarContainer}>
              {/* Background of XP bar */}
              <View style={styles.xpBarBackground} />
              
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
              
              {/* XP gained indicator */}
              <Animated.View 
                style={[
                  styles.xpGainedIndicator,
                  {
                    left: xpBarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [`${oldLevelProgress * 100}%`, `${oldLevelProgress * 100}%`]
                    }),
                    width: xpBarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', `${(newLevelProgress - oldLevelProgress) * 100}%`]
                    }),
                    opacity: xpBarAnim
                  }
                ]}
              >
                <LinearGradient
                  colors={[theme.colors.secondary, theme.colors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
              
              {/* Sparkle effects */}
              {showSparkles && sparkleOrigins.current.map((origin, index) => (
                <Animated.View 
                  key={index} 
                  style={[
                    styles.sparkleContainer, 
                    { 
                      left: `${origin.x}%`,
                      top: origin.y,
                      transform: [
                        { translateX: -moderateScale(15) },
                        { scale: sparkleAnimations[index] || new Animated.Value(0) },
                        { translateY: sparkleAnimations[index]?.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, -10, 0]
                        }) || 0 }
                      ],
                      opacity: sparkleAnimations[index] || new Animated.Value(0)
                    }
                  ]}
                >
                  <Confetti
                    count={15} // More particles
                    origin={{ x: 0, y: 0 }}
                    fallSpeed={1200}
                    explosionSpeed={450}
                    colors={[theme.colors.primary, theme.colors.secondary, '#FFC107', '#FFFFFF', '#FF5722']}
                    fadeOut={true}
                  />
                </Animated.View>
              ))}
              
              {/* XP gain indicator text */}
              {xpData.xpGained > 0 && (
                <Animated.View 
                  style={{
                    position: 'absolute',
                    top: -moderateScale(20),
                    left: `${(oldLevelProgress * 100) + ((newLevelProgress - oldLevelProgress) * 50) - 10}%`,
                    opacity: xpBarAnim,
                    transform: [{ scale: xpBarAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.5, 1.2, 1]
                    }) }]
                  }}
                >
                  <Typography 
                    variant="caption" 
                    style={{
                      color: theme.colors.secondary,
                      fontWeight: 'bold',
                      textShadowColor: 'rgba(0,0,0,0.3)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2
                    }}
                  >
                    +{xpData.xpGained} XP
                  </Typography>
                </Animated.View>
              )}
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
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Confetti } from '../atoms/ConfettiCannon';
import { moderateScale, scaledSpacing, scaledRadius } from '../utils/scaling';

interface XpProgressBarProps {
  oldXP: number;
  newXP: number;
  xpGained: number;
  levelXpRequired?: number;
  visible: boolean;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  oldXP,
  newXP,
  xpGained,
  levelXpRequired = 100,
  visible,
}) => {
  const theme = useTheme<AppTheme>();
  
  // Calculate levels and progress
  const oldLevels = Math.floor(oldXP / levelXpRequired);
  const newLevels = Math.floor(newXP / levelXpRequired);
  const oldLevelProgress = (oldXP % levelXpRequired) / levelXpRequired;
  const newLevelProgress = (newXP % levelXpRequired) / levelXpRequired;

  // Animation values
  const xpBarAnim = useRef(new Animated.Value(0)).current;
  const xpNumberAnim = useRef(new Animated.Value(0)).current;
  const secondaryBarAnim = useRef(new Animated.Value(0)).current;

  // Sparkle animation control
  const [showSparkles, setShowSparkles] = useState(false);
  const sparkleOrigins = useRef<Array<{x: number, y: number, delay: number}>>([]);
  const sparkleAnimations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (visible) {
      // Reset animation values
      xpBarAnim.setValue(0);
      xpNumberAnim.setValue(0);
      secondaryBarAnim.setValue(0);
      setShowSparkles(true); // Ensure sparkles are visible

      // Generate sparkle origins along the gained XP section
      const numSparkles = 8;
      const newSparkleOrigins = [];
      const gainStart = oldLevelProgress * 100;
      const gainWidth = (newLevelProgress - oldLevelProgress) * 100;
      
      sparkleAnimations.length = 0;
      
      for (let i = 0; i < numSparkles; i++) {
        const xPos = gainStart + (gainWidth * (i / (numSparkles - 1 || 1)));
        const yPos = Math.random() * 10 - 5;
        const delay = i * 100;
        newSparkleOrigins.push({ x: xPos, y: yPos, delay });
        sparkleAnimations.push(new Animated.Value(0));
      }
      sparkleOrigins.current = newSparkleOrigins;

      // Animate XP bar and sparkles
      Animated.parallel([
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(xpBarAnim, {
            toValue: 1,
            duration: 3000, // Increased duration for slower animation
            useNativeDriver: false,
            easing: Easing.out(Easing.cubic),
          })
        ]),
        Animated.sequence(
          sparkleAnimations.map((anim, index) => 
            Animated.sequence([
              Animated.delay(sparkleOrigins.current[index]?.delay || 0),
              Animated.spring(anim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
              })
            ])
          )
        )
      ]).start(() => {
        // Animate secondary bar if level up occurred
        if (newLevels > oldLevels) {
          Animated.timing(secondaryBarAnim, {
            toValue: 1,
            duration: 1000, // Increased duration for slower animation
            useNativeDriver: false,
          }).start();
        }

        // Hide sparkles after a delay
        setTimeout(() => {
          setShowSparkles(false);
          sparkleAnimations.forEach(anim => anim.setValue(0));
        }, 3000);
      });

      // Animate XP number counting up
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(xpNumberAnim, {
          toValue: 1,
          duration: 2000, // Increased duration for slower animation
          useNativeDriver: false,
        })
      ]).start();
    }
  }, [visible, oldXP, newXP]);

  // Interpolate XP bar width for partial progress
  const xpBarWidth = xpBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${oldLevelProgress * 100}%`, '100%'],
  });

  // Interpolate secondary XP bar width for new level progress
  const secondaryXpBarWidth = secondaryBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${newLevelProgress * 100}%`],
  });

  // Interpolate XP number
  const displayedXP = xpNumberAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [oldXP, newXP],
  });

  const styles = StyleSheet.create({
    xpContainer: {
      width: '100%',
      marginBottom: scaledSpacing(24),
      alignItems: 'center',
    },
    xpLabel: {
      fontSize: 16,
      marginBottom: scaledSpacing(8),
      color: theme.colors.onSurface,
    },
    xpValue: {
      fontSize: 24,
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
    secondaryXpBar: {
      zIndex: 1,
      backgroundColor: theme.colors.secondaryContainer,
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
      top: -moderateScale(80), // Further adjusted to ensure visibility above the progress bar
      height: moderateScale(60),
      width: moderateScale(30),
      zIndex: 10,
      pointerEvents: 'none',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.xpContainer}>
      <Typography variant="body1" style={styles.xpLabel}>Experience Points</Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Animated.Text style={[styles.xpValue, { color: theme.colors.success }]}>
          {displayedXP.interpolate({
            inputRange: [0, 1],
            outputRange: [oldXP.toString(), newXP.toString()]
          })}
        </Animated.Text>
        <Typography variant="body2" style={{ color: theme.colors.success, marginLeft: 4 }}> (+{xpGained})</Typography>
      </View>
      
      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBackground} />
        
        {/* Old XP progress (always visible) */}
        <View style={[styles.xpBar, { width: `${oldLevelProgress * 100}%` }]}>
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

        {/* Secondary XP progress for new level */}
        {newLevels > oldLevels && (
          <Animated.View 
            style={[
              styles.xpBar, 
              styles.secondaryXpBar, 
              { width: secondaryXpBarWidth }
            ]}
          >
            <LinearGradient
              colors={[theme.colors.secondary, theme.colors.secondaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        )}
        
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
              count={15}
              origin={{ x: 0, y: 0 }}
              fallSpeed={1200}
              explosionSpeed={450}
              colors={[theme.colors.primary, theme.colors.secondary, '#FFC107', '#FFFFFF', '#FF5722']}
              fadeOut={true}
            />
          </Animated.View>
        ))}
        
        {/* XP gain indicator text */}
        {xpGained > 0 && (
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
              +{xpGained} XP
            </Typography>
          </Animated.View>
        )}
      </View>
    </View>
  );
};
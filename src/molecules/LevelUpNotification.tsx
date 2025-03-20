import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { moderateScale, scaledSpacing } from '../utils/scaling';

interface LevelUpNotificationProps {
  visible: boolean;
  leveledUp: boolean;
  newLevel: number;
}

export const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  visible,
  leveledUp,
  newLevel,
}) => {
  const theme = useTheme<AppTheme>();
  const levelUpAnim = useRef(new Animated.Value(0)).current;
  
  // Animate level up notification when visible and leveled up
  useEffect(() => {
    if (visible && leveledUp) {
      // Reset animation value
      levelUpAnim.setValue(0);
      
      // Animate level up notification
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
  }, [visible, leveledUp]);
  
  // Don't render anything if not leveled up
  if (!leveledUp) {
    return null;
  }
  
  const styles = StyleSheet.create({
    levelUpContainer: {
      marginTop: scaledSpacing(2),
      marginBottom: scaledSpacing(2),
      padding: scaledSpacing(10),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      width: '50%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    levelUpText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    levelUpValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: scaledSpacing(8),
    },
  });

  return (
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
        {newLevel}
      </Typography>
    </Animated.View>
  );
};
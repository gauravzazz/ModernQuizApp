import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { moderateScale, scale, scaledFontSize, verticalScale } from '../utils/scaling';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileStatsProps {
  stats: {
    totalQuizzes: number;

    totalTime: number;
    xp: number;
    awards: number;
  };
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const theme = useTheme<AppTheme>();

  // Determine if we're on a small screen
  const isSmallScreen = SCREEN_WIDTH < 360;
  const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 600;
  
  // Animation values for each stat item
  const scaleAnims = useRef([
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8)
  ]).current;
  
  const opacityAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  
  // Animation for the container
  const containerAnim = useRef(new Animated.Value(0)).current;
  
  // Animation for stat values
  const valueAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  
  // Refs to track pressed state
  const pressedState = useRef([false, false, false, false, false]).current;
  
  // Animation sequence for entrance
  useEffect(() => {
    // Container animation
    Animated.timing(containerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    // Staggered animation for each stat item
    scaleAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(100 * index),
        Animated.parallel([
          Animated.spring(anim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnims[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ])
      ]).start();
      
      // Animate the values counting up
      Animated.timing(valueAnims[index], {
        toValue: 1,
        duration: 1200 + (index * 100),
        useNativeDriver: false,
      }).start();
    });
  }, []);
  
  // Function to handle press animation
  const handlePress = (index: number) => {
    pressedState[index] = !pressedState[index];
    
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  // Get the icon for each stat
  const getStatIcon = (index: number) => {
    const icons = [
      'book-open-variant',  // Quizzes
      'clock-outline',      // Hours
      'star',               // XP
      'trophy',             // Awards
    ];
    
    return icons[index] || 'information-outline';
  };
  
  // Format time value to display hours and minutes
  const formatTimeValue = (hours: number): string => {
    // Check if hours is a valid number
    if (isNaN(hours) || hours === undefined || hours === null) {
      console.log('[TIME_DEBUG] Invalid hours value in formatTimeValue:', hours);
      return '0h 0m'; // Return default value for invalid input
    }
    
    console.log('[TIME_DEBUG] Valid hours value in formatTimeValue:', hours);
    const totalMinutes = Math.round(hours * 60);
    const displayHours = Math.floor(totalMinutes / 60);
    const displayMinutes = totalMinutes % 60;
    console.log('[TIME_DEBUG] Calculated display values:', { totalMinutes, displayHours, displayMinutes });
    return `${displayHours}h ${displayMinutes}m`;
  };

  // Get the interpolated value for animations
  const getAnimatedValue = (index: number, value: number) => {
    // Ensure value is a valid number to prevent NaN
    const safeValue = isNaN(value) || value === undefined || value === null ? 0 : value;
    
    // For time stats (index 1), we'll format the output
    if (index === 1) {
      return valueAnims[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, safeValue],
        extrapolate: 'clamp'
      });
    }
    
    return valueAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, safeValue],
      extrapolate: 'clamp'
    });
  };

  // Get gradient colors based on stat type
  const getGradientColors = (index: number): readonly [string, string] => {
    const gradients = [
      [theme.colors.primary, theme.colors.primaryContainer] as const,       // Quizzes
      [theme.colors.success, theme.colors.successContainer || '#4CAF50'] as const, // Correct
      [theme.colors.info || '#2196F3', theme.colors.infoContainer || '#64B5F6'] as const, // Hours
      [theme.colors.warning || '#FF9800', theme.colors.warningContainer || '#FFB74D'] as const, // XP
      [theme.colors.error || '#F44336', theme.colors.errorContainer || '#E57373'] as const, // Awards
    ];
    
    return gradients[index] || [theme.colors.primary, theme.colors.primaryContainer] as const;
  };
  
  // Get text color based on stat type for better contrast
  const getStatTextColor = (index: number) => {
    const colors = [
      theme.colors.primary,       // Quizzes
         // Correct
      theme.colors.info || '#2196F3', // Hours
      theme.colors.warning || '#FF9800', // XP
      theme.colors.error || '#F44336', // Awards
    ];
    
    return colors[index] || theme.colors.primary;
  };
  
  const styles = StyleSheet.create({
    container: {
      marginTop: verticalScale(16),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: moderateScale(isSmallScreen ? 8 : 10),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(6), height: moderateScale(6) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(12),
      elevation: moderateScale(10),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      marginBottom: verticalScale(24),
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
    },
    containerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.08,
    },
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: verticalScale(isSmallScreen ? 10 : 20),
      paddingHorizontal: scale(isSmallScreen ? 1 : 2),
      gap: scale(isSmallScreen ? 1 : 4),
      zIndex: 2,
    },
    sectionTitle: {
      fontSize: moderateScale(20),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: verticalScale(20),
      paddingHorizontal: scale(8),
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    statItem: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      paddingVertical: verticalScale(isSmallScreen ? 10 : 14),
      paddingHorizontal: scale(isSmallScreen ? 8 : 12),
      borderRadius: theme.roundness * 1.5,
      // Calculate width to maintain two columns with proper spacing
      width: (SCREEN_WIDTH - scale(isSmallScreen ? 48 : 64)) / 2 - scale(isSmallScreen ? 4 : 8),
      // Ensure the height is consistent
      height: isSmallScreen ? verticalScale(90) : verticalScale(100),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      marginBottom: verticalScale(12),
      marginHorizontal: scale(4),
      position: 'relative',
      overflow: 'hidden',
    },
    statItemGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    statIconContainer: {
      position: 'absolute',
      top: moderateScale(isSmallScreen ? 6 : 8),
      right: moderateScale(isSmallScreen ? 6 : 8),
      width: moderateScale(isSmallScreen ? 24 : 28),
      height: moderateScale(isSmallScreen ? 24 : 28),
      borderRadius: moderateScale(isSmallScreen ? 12 : 14),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.9,
    },
    statValue: {
      fontSize: scaledFontSize(isSmallScreen ? 14 : 16),
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginTop: verticalScale(4),
    },
    statLabel: {
      color: theme.colors.onSurfaceVariant,
      fontSize: isSmallScreen ? moderateScale(10) : isMediumScreen ? moderateScale(12) : moderateScale(14),
      fontWeight: '600',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      textAlign: 'center',
      paddingHorizontal: scale(4),
    },
  });

  // Array of stat values for easier mapping
  const statValues = [
    stats.totalQuizzes || 0,
   
    stats.totalTime || 0,
    stats.xp || 0,
    stats.awards || 0
  ];
  
  // Array of stat labels
  const statLabels = ['Quizzes', 'Hours', 'XP', 'Awards'];
  
  return (
    <Animated.View 
      style={[styles.container, {
        transform: [{
          translateY: containerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }],
        opacity: containerAnim
      }]}
    >
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.containerBackground}
      />
      <Typography variant="h6" style={styles.sectionTitle}>Your Stats</Typography>
      <View style={styles.statsRow}>
        {statValues.map((value, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.9}
            onPress={() => handlePress(index)}
          >
            <Animated.View 
              style={[styles.statItem, {
                transform: [{ scale: scaleAnims[index] }],
                opacity: opacityAnims[index]
              }]}
            >
              <LinearGradient
                colors={getGradientColors(index)}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={[styles.statItemGradient, { opacity: 0.15 }]}
              />
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons 
                  name={getStatIcon(index) as any} 
                  size={moderateScale(isSmallScreen ? 14 : 18)} 
                  color={getStatTextColor(index)} 
                />
              </View>
              <Animated.Text 
                style={[styles.statValue, {
                  color: getStatTextColor(index)
                }]}
              >
                {index === 1 
                  ? valueAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0h 0m', formatTimeValue(value || 0)],
                      extrapolate: 'clamp'
                    })
                  : valueAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [`0`, `${Math.floor(value || 0)}`],
                      extrapolate: 'clamp'
                    })}
              </Animated.Text>
              <Typography 
                style={[styles.statLabel, {
                  color: theme.colors.onSurfaceVariant,
                  opacity: 0.9
                }]}
              >
                {statLabels[index]}
              </Typography>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};
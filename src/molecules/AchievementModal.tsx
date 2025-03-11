import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { lightGradients, darkGradients } from '../theme';
import { GradientColors } from '../theme/types';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { UserAward } from '../types/profile';
import { moderateScale, scale, verticalScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

interface AchievementModalProps {
  visible: boolean;
  onClose: () => void;
  awards: UserAward[];
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  onClose,
  awards,
}) => {
  const theme = useTheme<AppTheme>();
  const { width: screenWidth } = Dimensions.get('window');
  
  // Determine screen size for responsive design
  const isSmallScreen = screenWidth < 360;
  const isMediumScreen = screenWidth >= 360 && screenWidth < 600;
  
  // Animation values
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef(awards.map(() => new Animated.Value(0))).current;
  
  // Run animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      modalScaleAnim.setValue(0.8);
      modalOpacityAnim.setValue(0);
      cardAnimations.forEach(anim => anim.setValue(0));
      
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
      
      // Staggered animation for award cards
      cardAnimations.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(100 + (index * 150)),
          Animated.spring(anim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          })
        ]).start();
      });
    }
  }, [visible, awards.length]);
  
  // Calculate dimensions based on screen size
  const modalWidth = isSmallScreen ? '95%' : isMediumScreen ? '90%' : '85%';
  const maxModalWidth = isSmallScreen ? 320 : isMediumScreen ? 400 : 450;
  const awardItemWidth = isSmallScreen ? 140 : isMediumScreen ? 160 : 180;
  const awardIconSize = isSmallScreen ? scaledFontSize(40) : scaledFontSize(48);
  const titleFontSize = isSmallScreen ? scaledFontSize(20) : scaledFontSize(24);
  const awardNameFontSize = isSmallScreen ? scaledFontSize(15) : scaledFontSize(17);
  const awardDescFontSize = isSmallScreen ? scaledFontSize(12) : scaledFontSize(13);
  const modalPadding = scaledSpacing(isSmallScreen ? 20 : 28);
  const itemPadding = scaledSpacing(isSmallScreen ? 16 : 20);
  const itemGap = scaledSpacing(isSmallScreen ? 16 : 20);
  
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
      maxHeight: '90%',
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
    scrollView: {
      width: '100%',
      maxHeight: isSmallScreen ? '60%' : '70%',
    },
    scrollViewContent: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: scaledSpacing(8),
      gap: itemGap,
    },
    awardCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: scaledRadius(theme.roundness * 1.5),
      padding: itemPadding,
      width: awardItemWidth,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      margin: scaledSpacing(4),
      overflow: 'hidden',
    },
    awardCardGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.15,
    },
    awardIconContainer: {
      width: moderateScale(70),
      height: moderateScale(70),
      borderRadius: moderateScale(35),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scaledSpacing(12),
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    awardIcon: {
      fontSize: awardIconSize,
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    awardName: {
      textAlign: 'center',
      marginBottom: scaledSpacing(8),
      fontSize: awardNameFontSize,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    awardDescription: {
      textAlign: 'center',
      fontSize: awardDescFontSize,
      color: theme.colors.onSurfaceVariant,
      opacity: 0.9,
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
      letterSpacing: 0.5,
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: scaledRadius(theme.roundness * 2),
    },
  });

  // Get gradient colors based on award type
  const getGradientColors = (index: number): readonly [string, string, ...string[]] => {
    // Use the theme gradients based on dark/light mode
    const themeGradients = theme.dark ? darkGradients : lightGradients;
    const gradientTypes = ['primary', 'success', 'info', 'warning', 'error'] as const;
    const gradientType = gradientTypes[index % gradientTypes.length] as keyof GradientColors;
    
    // Ensure we return a properly typed tuple with at least two colors
    const colors = themeGradients[gradientType] || themeGradients.primary;
    return colors as readonly [string, string, ...string[]];
  };


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
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
              🎉 Achievement Unlocked! 🎉
            </Typography>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
          >
            {awards.map((award, index) => (
              <Animated.View 
                key={award.id} 
                style={[
                  styles.awardCard,
                  {
                    transform: [
                      { scale: cardAnimations[index] },
                      { translateY: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })}
                    ],
                    opacity: cardAnimations[index]
                  }
                ]}
              >
                <LinearGradient
                  colors={getGradientColors(index)}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.awardCardGradient}
                />
                
                <View style={styles.awardIconContainer}>
                  <Typography style={styles.awardIcon}>{award.icon}</Typography>
                </View>
                
                <Typography weight="bold" style={styles.awardName}>
                  {award.name}
                </Typography>
                
                <Typography variant="caption" style={styles.awardDescription}>
                  {award.description}
                </Typography>
              </Animated.View>
            ))}
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Typography style={styles.buttonText}>Awesome!</Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
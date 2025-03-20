import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

// Hook to determine screen size for responsive design
export const useScreenSize = () => {
  const { width: screenWidth } = Dimensions.get('window');
  
  const isSmallScreen = screenWidth < 360;
  const isMediumScreen = screenWidth >= 360 && screenWidth < 600;
  
  const modalWidth = isSmallScreen ? '95%' : isMediumScreen ? '98%' : '85%';
  const maxModalWidth = isSmallScreen ? 320 : isMediumScreen ? 400 : 450;
  const titleFontSize = isSmallScreen ? scaledFontSize(10) : scaledFontSize(14);
  const subtitleFontSize = isSmallScreen ? scaledFontSize(8) : scaledFontSize(10);
  const modalPadding = scaledSpacing(isSmallScreen ? 10 : 18);
  
  return {
    isSmallScreen,
    isMediumScreen,
    modalWidth,
    maxModalWidth,
    titleFontSize,
    subtitleFontSize,
    modalPadding,
  };
};

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  onClose,
  children,
}) => {
  const theme = useTheme<AppTheme>();
  const { modalWidth, maxModalWidth, modalPadding } = useScreenSize();
  
  // Calculate numeric width based on screen width
  const screenWidth = Dimensions.get('window').width;
  const numericModalWidth = modalWidth.endsWith('%') 
    ? (parseFloat(modalWidth) / 100) * screenWidth 
    : parseFloat(modalWidth);

  // Animation values
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Run animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      modalScaleAnim.setValue(0.8);
      modalOpacityAnim.setValue(0);
      
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
    }
  }, [visible]);
  
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
      width: numericModalWidth, // Use numeric width
      maxWidth: maxModalWidth,
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5) as number, height: moderateScale(5) as number },
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
          
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

// Export animation values for child components to use
export const useModalAnimations = () => {
  const modalScaleAnim = useRef(new Animated.Value(1)).current;
  const modalOpacityAnim = useRef(new Animated.Value(1)).current;
  
  return {
    modalScaleAnim,
    modalOpacityAnim,
  };
};
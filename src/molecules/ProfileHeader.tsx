import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Modal, TextInput, Animated, Alert, Platform, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { moderateScale, scale, verticalScale } from '../utils/scaling';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  level: number;
  onEditPress?: () => void;
  onProfileUpdate?: (data: { name?: string; avatar?: string }) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatar,
  level,
  onEditPress,
  onProfileUpdate,
}) => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  
  // State for modals and editing
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [isEditAvatarModalVisible, setIsEditAvatarModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [tempAvatar, setTempAvatar] = useState<string | undefined>(avatar);
  
  // Animation values
  const avatarScale = useRef(new Animated.Value(1)).current;
  const avatarOpacity = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  // Animation functions
  const animateAvatarPress = () => {
    Animated.sequence([
      Animated.timing(avatarScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(avatarScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateModalIn = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateModalOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback ? () => callback() : undefined);
  };

  // Image picker function
  const pickImage = async () => {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture');
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'There was a problem selecting your image');
    }
  };

  // Take photo function
  const takePhoto = async () => {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need camera permissions to take a new profile picture');
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'There was a problem taking your photo');
    }
  };

  // Save profile changes
  const saveProfileChanges = () => {
    if (onProfileUpdate) {
      onProfileUpdate({
        name: editedName,
        avatar: tempAvatar,
      });
    }
    setIsEditAvatarModalVisible(false);
  };

  // Handle name edit
  const handleNameEdit = () => {
    setIsEditNameModalVisible(true);
  };

  const saveNameEdit = () => {
    if (onProfileUpdate && editedName.trim() !== '') {
      onProfileUpdate({ name: editedName });
    }
    setIsEditNameModalVisible(false);
  };

  const styles = StyleSheet.create({
    header: {
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(36),
      paddingHorizontal: scale(24),
      backgroundColor: theme.colors.neuPrimary,
      borderBottomLeftRadius: theme.roundness * 2,
      borderBottomRightRadius: theme.roundness * 2,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 0, height: moderateScale(8) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(15),
      elevation: moderateScale(12),
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: verticalScale(12),
      paddingRight: scale(16),
    },
    avatarContainer: {
      marginRight: scale(22),
      borderWidth: moderateScale(3),
      borderColor: 'rgba(255,255,255,0.4)',
      borderRadius: moderateScale(70),
      padding: moderateScale(3),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: moderateScale(5) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(10),
      elevation: moderateScale(10),
      position: 'relative',
    },
    avatarEditButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.primary,
      borderRadius: moderateScale(15),
      width: moderateScale(32),
      height: moderateScale(32),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: moderateScale(2) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(3),
      elevation: moderateScale(5),
      borderWidth: 2,
      borderColor: '#FFFFFF',
      zIndex: 10,
    },
    userInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    userNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: verticalScale(8),
    },
    userName: {
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      fontSize: moderateScale(22),
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 0, height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
      marginRight: scale(10),
    },
    nameEditButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: moderateScale(12),
      width: moderateScale(28),
      height: moderateScale(28),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    userEmail: {
      color: theme.colors.onPrimary,
      opacity: 0.9,
      fontSize: moderateScale(14),
      marginTop: verticalScale(2),
      
    },
    editButton: {
      position: 'absolute',
      top: insets.top + verticalScale(35),
      right: scale(10),
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: moderateScale(20),
      padding: moderateScale(1),
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowOffset: { width: 0, height: moderateScale(2) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    levelBadge: {
      position: 'absolute',
      top: verticalScale(100),
      right: scale(24),
      backgroundColor: theme.colors.success,
      borderRadius: moderateScale(20),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(8),
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: 'rgba(0,0,0,0.3)',
      shadowOffset: { width: 0, height: moderateScale(3) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(5),
      elevation: moderateScale(5),
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageModal: {
      width: '90%',
      aspectRatio: 1,
      borderRadius: moderateScale(20),
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    modalImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    closeButton: {
      position: 'absolute',
      top: moderateScale(20),
      right: moderateScale(20),
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: moderateScale(20),
      width: moderateScale(40),
      height: moderateScale(40),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    editModal: {
      width: '80%',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: moderateScale(20),
      padding: moderateScale(24),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: moderateScale(10) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(15),
      elevation: moderateScale(15),
    },
    modalTitle: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      marginBottom: verticalScale(16),
      color: theme.colors.onSurface,
    },
    inputContainer: {
      width: '100%',
      marginBottom: verticalScale(20),
    },
    input: {
      backgroundColor: theme.colors.background,
      borderRadius: moderateScale(10),
      padding: moderateScale(12),
      fontSize: moderateScale(16),
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
      color: theme.colors.onSurface,
      width: '100%',
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: verticalScale(16),
    },
    avatarOptionsContainer: {
      width: '100%',
      marginVertical: verticalScale(16),
    },
    avatarOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: moderateScale(12),
      borderRadius: moderateScale(10),
      marginBottom: verticalScale(10),
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    avatarOptionText: {
      marginLeft: scale(12),
      fontSize: moderateScale(16),
      color: theme.colors.onSurface,
    },
    levelText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginLeft: scale(8),
      fontSize: moderateScale(14),
      letterSpacing: 0.5,
    },
  });

  return (
    <>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Animated.View 
            style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}
          >
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => {
                animateAvatarPress();
                setIsImageModalVisible(true);
                animateModalIn();
              }}
            >
              <Avatar 
                size="large" 
                source={tempAvatar ? { uri: tempAvatar } : avatar ? { uri: avatar } : undefined} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.avatarEditButton} 
              activeOpacity={0.8} 
              onPress={() => setIsEditAvatarModalVisible(true)}
            >
              <MaterialCommunityIcons 
                name="camera" 
                size={moderateScale(16)} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.userInfo}>
            <View style={styles.userNameContainer}>
              <Typography variant="h5" style={styles.userName}>
                {editedName || name}
              </Typography>
              <TouchableOpacity 
                style={styles.nameEditButton} 
                activeOpacity={0.8} 
                onPress={handleNameEdit}
              >
                <MaterialCommunityIcons 
                  name="pencil" 
                  size={moderateScale(14)} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>
            <Typography style={styles.userEmail}>
              {email}
            </Typography>
          </View>
        </View>

        {onEditPress && (
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={onEditPress}>
            <MaterialCommunityIcons 
              name="account-edit" 
              size={moderateScale(20)} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        )}

        <View style={styles.levelBadge}>
          <MaterialCommunityIcons 
            name="star" 
            size={moderateScale(16)} 
            color="#FFFFFF" 
          />
          <Typography style={styles.levelText}>Level {level}</Typography>
        </View>
      </LinearGradient>

      {/* Image Enlargement Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          animateModalOut(() => setIsImageModalVisible(false));
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => {
            animateModalOut(() => setIsImageModalVisible(false));
          }}
        >
          <Animated.View 
            style={[styles.imageModal, { 
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }]}
          >
            <Image 
              source={tempAvatar ? { uri: tempAvatar } : avatar ? { uri: avatar } : { uri: 'https://ui-avatars.com/api/?background=random&name=' + (name || '?') }}
              style={styles.modalImage}
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => {
                animateModalOut(() => setIsImageModalVisible(false));
              }}
            >
              <MaterialCommunityIcons 
                name="close" 
                size={moderateScale(24)} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={isEditNameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[styles.editModal, { 
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }]}
          >
            <Typography style={styles.modalTitle}>Edit Your Name</Typography>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                autoFocus
              />
            </View>
            <View style={styles.modalButtonsContainer}>
              <Button 
                label="Cancel" 
                onPress={() => {
                  setEditedName(name); // Reset to original
                  animateModalOut(() => setIsEditNameModalVisible(false));
                }}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button 
                label="Save" 
                onPress={saveNameEdit}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Edit Avatar Modal */}
      <Modal
        visible={isEditAvatarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[styles.editModal, { 
              transform: [{ scale: modalScale }],
              opacity: modalOpacity
            }]}
          >
            <Typography style={styles.modalTitle}>Change Profile Picture</Typography>
            <View style={styles.avatarOptionsContainer}>
              <TouchableOpacity style={styles.avatarOption} onPress={takePhoto}>
                <MaterialCommunityIcons 
                  name="camera" 
                  size={moderateScale(24)} 
                  color={theme.colors.primary} 
                />
                <Typography style={styles.avatarOptionText}>Take a Photo</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarOption} onPress={pickImage}>
                <MaterialCommunityIcons 
                  name="image" 
                  size={moderateScale(24)} 
                  color={theme.colors.primary} 
                />
                <Typography style={styles.avatarOptionText}>Choose from Gallery</Typography>
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtonsContainer}>
              <Button 
                label="Cancel" 
                onPress={() => {
                  setTempAvatar(avatar); // Reset to original
                  animateModalOut(() => setIsEditAvatarModalVisible(false));
                }}
                variant="secondary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button 
                label="Save" 
                onPress={saveProfileChanges}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};
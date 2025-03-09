import React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { Avatar } from './Avatar';

interface SideBarProps {
  visible: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.8;
const ANIMATION_DURATION = 400;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SideBar: React.FC<SideBarProps> = ({ visible, onClose }) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const menuItemScale = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          tension: 25,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(menuItemScale, {
          toValue: 1,
          tension: 30,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: -SIDEBAR_WIDTH,
          tension: 30,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION - 100,
          useNativeDriver: true,
        }),
        Animated.spring(menuItemScale, {
          toValue: 0.9,
          tension: 30,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 9999,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.75)',
      zIndex: 9999,
    },
    sidebar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIDEBAR_WIDTH,
      height: '100%',
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 8, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 24,
      borderRightWidth: Platform.OS === 'ios' ? 0.5 : 0,
      borderColor: 'rgba(255,255,255,0.1)',
      zIndex: 10000,
    },
    sidebarContent: {
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingHorizontal: 20,
      paddingBottom: 20,
      flex: 1,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 32,
      padding: 24,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: 24,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    userName: {
      marginTop: 16,
      marginBottom: 4,
      fontSize: 20,
      textAlign: 'center',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      transform: [{ scale: 1 }],
    },
    menuIcon: {
      width: 42,
      height: 42,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    menuText: {
      fontSize: 16,
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.06)',
      marginVertical: 16,
      width: '100%',
    },
  });

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <Animated.View style={{ transform: [{ scale: menuItemScale }] }}>
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuIcon}>
          <Typography style={{ fontSize: 20 }}>{icon}</Typography>
        </View>
        <Typography variant="body1" weight="medium" style={styles.menuText}>
          {label}
        </Typography>
      </TouchableOpacity>
    </Animated.View>
  );

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableOpacity>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <ScrollView 
          contentContainerStyle={styles.sidebarContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <Animated.View style={[styles.profileSection, { transform: [{ scale: menuItemScale }] }]}>
            <Avatar size="large" />
            <Typography variant="h6" weight="bold" style={styles.userName}>
              John Doe
            </Typography>
            <Typography variant="body2" color="onSurfaceVariant">
              john.doe@example.com
            </Typography>
          </Animated.View>

          <MenuItem
            icon="📚"
            label="My Subjects"
            onPress={() => {
              onClose();
              navigation.navigate('SubjectDetail', { 
                subjectId: 'default',
                title: 'My Subjects'
              });
            }}
          />

          <MenuItem
            icon="🔖"
            label="Bookmarks"
            onPress={() => {
              onClose();
              navigation.navigate('Bookmarks');
            }}
          />

          <View style={styles.divider} />

          <MenuItem
            icon="📊"
            label="Progress"
            onPress={() => {
              onClose();
              navigation.navigate('Progress');
            }}
          />

          <MenuItem
            icon="🏆"
            label="Achievements"
            onPress={() => {
              onClose();
              navigation.navigate('QuizHistory');
            }}
          />

          <View style={styles.divider} />

          <MenuItem
            icon="⚙️"
            label="Settings"
            onPress={() => {
              onClose();
              navigation.navigate('Settings');
            }}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};
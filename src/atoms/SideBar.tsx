import React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
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

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.75;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SideBar: React.FC<SideBarProps> = ({ visible, onClose }) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10000, // Increased z-index to be higher than header
      position: 'absolute',
      width: '100%',
      height: '100%',
      elevation: 1000,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9998,
    },
    sidebar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIDEBAR_WIDTH,
      height: '100%',
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 6, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 12,
      elevation: 1000,
      borderRightWidth: 1.5,
      borderColor: theme.colors.neuLight,
      zIndex: 10000, // Increased z-index to be higher than header
    },
    sidebarContent: {
      paddingTop: 50, // Increased top padding to account for header height
      paddingHorizontal: 24,
      paddingBottom: 100, // Add significant padding at the bottom for better spacing
      flexGrow: 1, // Allow content to grow but enable scrolling
    },
  
    profileSection: {
      alignItems: 'center',
      marginBottom: 40,
      backgroundColor: theme.colors.neuPrimary,
      padding: 24,
      borderRadius: theme.roundness * 2,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    userName: {
      marginTop: 16,
      marginBottom: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 16,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    menuIcon: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX }] },
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.sidebarContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="always"
        >
          <View style={styles.profileSection}>
            <Avatar size="large" />
            <Typography
              variant="h6"
              weight="bold"
              style={styles.userName}
            >
              John Doe
            </Typography>
            <Typography variant="body2" color="onSurfaceVariant">
              john.doe@example.com
            </Typography>
          </View>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onClose();
              navigation.navigate('SubjectDetail', { subjectId: 'default' });
            }}
          >
            <View style={styles.menuIcon}>
              <Typography>📚</Typography>
            </View>
            <Typography variant="body1" weight="medium">
              My Subjects
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onClose();
              navigation.navigate('Bookmarks');
            }}
          >
            <View style={styles.menuIcon}>
              <Typography>🔖</Typography>
            </View>
            <Typography variant="body1" weight="medium">
              Bookmarks
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onClose();
              navigation.navigate('Progress');
            }}
          >
            <View style={styles.menuIcon}>
              <Typography>📊</Typography>
            </View>
            <Typography variant="body1" weight="medium">
              Progress
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onClose();
              navigation.navigate('QuizHistory');
            }}
          >
            <View style={styles.menuIcon}>
              <Typography>🏆</Typography>
            </View>
            <Typography variant="body1" weight="medium">
              Achievements
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              onClose();
              navigation.navigate('Settings');
            }}
          >
            <View style={styles.menuIcon}>
              <Typography>⚙️</Typography>
            </View>
            <Typography variant="body1" weight="medium">
              Settings
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};
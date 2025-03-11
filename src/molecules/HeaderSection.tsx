import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { SearchBar } from '../atoms/SearchBar';
import { Avatar } from '../atoms/Avatar';
import { useNotifications } from '../context/NotificationContext';
import { RootStackParamList } from '../navigation';

export interface HeaderSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  searchQuery,
  onSearchChange,
  onAvatarPress,
  onNotificationPress,
  notificationCount,
}) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();
  const { unreadCount } = useNotifications();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background,
      zIndex: 999,
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    topSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    notificationButton: {
      width: 44,
      height: 44,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    notificationBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      minWidth: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    searchContainer: {
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            onPress={onAvatarPress || (() => navigation.dispatch(DrawerActions.openDrawer()))}
            activeOpacity={0.8}
          >
            <Avatar size="medium" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress || (() => navigation.navigate('Notifications'))}
          activeOpacity={0.8}
        >
          {(notificationCount || unreadCount) > 0 && (
            <View style={styles.notificationBadge}>
              <Typography variant="caption" color="onPrimary">
                {notificationCount || unreadCount}
              </Typography>
            </View>
          )}
          <Typography color="onSurfaceVariant">🔔</Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search subjects..." 
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
};
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { useNotifications } from '../context/NotificationContext';
import { NavigationButton } from '../atoms/NavigationButton';

export const NotificationScreen = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation();
  const { notifications, markAsRead, clearNotification, markAllAsRead } = useNotifications();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 48,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    notificationList: {
      paddingHorizontal: 16,
    },
    notificationItem: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      position: 'absolute',
      top: 8,
      right: 8,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    timestamp: {
      opacity: 0.7,
    },
    clearButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.roundness,
      padding: 8,
      marginLeft: 8,
    },
  });

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavigationButton variant="left" onPress={() => navigation.goBack()} />
        <Typography variant="h6" weight="bold">
          Notifications
        </Typography>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={markAllAsRead}>
            <Typography variant="button" color="primary">
              Mark all as read
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.notificationList}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationItem}
            onPress={() => markAsRead(notification.id)}
          >
            {!notification.read && <View style={styles.unreadIndicator} />}
            <View style={styles.notificationHeader}>
              <Typography variant="body1" weight="medium">
                {getNotificationIcon(notification.type)} {notification.title}
              </Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography
                  variant="caption"
                  color="onSurfaceVariant"
                  style={styles.timestamp}
                >
                  {formatTimestamp(notification.timestamp)}
                </Typography>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => clearNotification(notification.id)}
                >
                  <Typography variant="caption" color="onPrimary">
                    Clear
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
            <Typography variant="body2" color="onSurfaceVariant">
              {notification.message}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
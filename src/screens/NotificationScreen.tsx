import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
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
      padding: 16,
    },
    header: {
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
      marginLeft: 'auto',
    },
    markAllButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness,
      paddingHorizontal: 12,
      paddingVertical: 8,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    notificationList: {
      paddingTop: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingBottom: 100,
    },
    notificationItem: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 1.5,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      position: 'relative',
      overflow: 'hidden',
    },
    unreadNotification: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    unreadIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
      position: 'absolute',
      top: 16,
      right: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 2,
    },
    notificationTitle: {
      marginBottom: 8,
      paddingRight: 16,
    },
    notificationTime: {
      marginTop: 8,
      alignSelf: 'flex-end',
    },
    notificationActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 12,
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.neuPrimary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
    },
    readButton: {
      backgroundColor: theme.colors.success,
    },
  });

  const renderNotificationItem = (notification: any, index: number) => {
    return (
      <View 
        key={notification.id} 
        style={[styles.notificationItem, notification.unread && styles.unreadNotification]}
      >
        {notification.unread && <View style={styles.unreadIndicator} />}
        <Typography variant="h6" weight="bold" style={styles.notificationTitle}>
          {notification.title}
        </Typography>
        <Typography variant="body1">
          {notification.message}
        </Typography>
        <Typography variant="caption" style={styles.notificationTime}>
          {notification.time}
        </Typography>
        <View style={styles.notificationActions}>
          {notification.unread && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.readButton]}
              onPress={() => markAsRead(notification.id)}
            >
              <Typography variant="caption" color="onPrimary">
                Mark as Read
              </Typography>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => clearNotification(notification.id)}
          >
            <Typography variant="caption" color="onPrimary">
              Delete
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavigationButton 
          variant="left" 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="h4" weight="bold">
          Notifications
        </Typography>
        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Typography variant="caption" color="onPrimary">
                Mark All as Read
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {notifications.length > 0 ? (
        <ScrollView style={styles.notificationList}>
          {notifications.map(renderNotificationItem)}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Typography variant="h5" weight="bold" style={{ marginBottom: 12 }}>
            No Notifications
          </Typography>
          <Typography variant="body1" style={{ textAlign: 'center' }}>
            You don't have any notifications at the moment. We'll notify you when there's something new!
          </Typography>
        </View>
      )}
    </View>
  );
};
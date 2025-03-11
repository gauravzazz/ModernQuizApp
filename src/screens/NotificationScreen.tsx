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
      //paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 48,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      //paddingHorizontal: 16,
      marginBottom: 24,
      //backgroundColor: theme.colors.neuPrimary,
      //borderRadius: theme.roundness,
      paddingVertical: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 8,
      //borderWidth: 1,
      //borderColor: theme.colors.neuLight,
      marginHorizontal: 16,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
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
      paddingHorizontal: 16,
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
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      alignItems: 'flex-start',
    },
    notificationTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
      paddingRight: 8,
    },
    notificationIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    notificationActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timestamp: {
      opacity: 0.7,
      marginRight: 8,
    },
    clearButton: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.roundness,
      paddingHorizontal: 10,
      paddingVertical: 6,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    notificationContent: {
      marginTop: 4,
      paddingLeft: 40, // Align with title text after icon
    },
    notificationDivider: {
      height: 1,
      backgroundColor: theme.colors.neuLight,
      opacity: 0.5,
      marginVertical: 12,
      marginLeft: 40,
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
        <View style={styles.headerTitle}>
          <NavigationButton variant="left" onPress={() => navigation.goBack()} />
          <Typography variant="h6" weight="bold">
            🔔 Notifications
          </Typography>
        </View>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead} activeOpacity={0.8}>
              <Typography variant="button" color="onPrimary" size={12}>
                Mark all as read
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography variant="h5" weight="bold" style={{ marginBottom: 16 }}>
            No notifications yet
          </Typography>
          <Typography variant="body1" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
            When you receive notifications, they will appear here.
          </Typography>
        </View>
      ) : (
        <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[styles.notificationItem, !notification.read && styles.unreadNotification]}
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.9}
            >
              {!notification.read && <View style={styles.unreadIndicator} />}
              <View style={styles.notificationHeader}>
                <View style={styles.notificationTitle}>
                  <View style={styles.notificationIcon}>
                    <Typography variant="body1">
                      {getNotificationIcon(notification.type)}
                    </Typography>
                  </View>
                  <Typography variant="body1" weight="bold" numberOfLines={2}>
                    {notification.title}
                  </Typography>
                </View>
                <View style={styles.notificationActions}>
                  <Typography
                    variant="caption"
                    color="onSurfaceVariant"
                    style={styles.timestamp}
                  >
                    {formatTimestamp(notification.timestamp)}
                  </Typography>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      clearNotification(notification.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <Typography variant="caption" color="onPrimary">
                      Clear
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.notificationDivider} />
              <View style={styles.notificationContent}>
                <Typography variant="body2" color="onSurfaceVariant">
                  {notification.message}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};
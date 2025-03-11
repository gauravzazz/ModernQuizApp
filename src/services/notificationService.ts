import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationToken {
  data: string;
  type: string;
}

export class NotificationService {
  static async registerForPushNotifications(): Promise<PushNotificationToken | null> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      if (Platform.OS === 'android') {
        await this.setupAndroidChannel();
      }

      return {
        data: token.data,
        type: token.type,
      };
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  static async setupAndroidChannel() {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    await Notifications.setNotificationChannelAsync('quiz-reminders', {
      name: 'Quiz Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    await Notifications.setNotificationChannelAsync('achievements', {
      name: 'Achievements',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  static async scheduleLocalNotification({
    title,
    body,
    data = {},
    trigger = null,
    channelId = 'default',
  }: {
    title: string;
    body: string;
    data?: object;
    trigger?: Notifications.NotificationTriggerInput;
    channelId?: string;
  }) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        ...(Platform.OS === 'android' ? { channelId } : {}),
      },
      trigger,
    });
  }

  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  static async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  static async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }
}
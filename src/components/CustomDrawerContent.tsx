import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Avatar } from '../atoms/Avatar';

const DrawerItems = [
  { label: 'Home', icon: '🏠', route: 'Home' },
  { label: 'Bookmarks', icon: '🔖', route: 'Bookmarks' },
  { label: 'Quiz History', icon: '📚', route: 'QuizHistory' },
  { label: 'Progress', icon: '📊', route: 'Progress' },
  { label: 'Notifications', icon: '🔔', route: 'Notifications' },
  { label: 'Settings', icon: '⚙️', route: 'Settings' },
  { label: 'Logout', icon: '🚫', route: 'Logout', isLogout: true },
];

export const CustomDrawerContent = (props: any) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      position: 'relative',
    },
    profileSection: {
      marginBottom: 32,
      marginHorizontal: 20,
      borderRadius: 24,
      //padding: 24,
      alignItems: 'center',
    },
    avatarContainer: {
      padding: 3,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      marginBottom: 16,
    },
    profileInfo: {
      alignItems: 'center',
    },
    profileName: {
      marginBottom: 4,
      fontWeight: '700',
    },
    profileEmail: {
      opacity: 0.8,
    },
    drawerItem: {
      borderRadius: 16,
      marginHorizontal: 20,
      marginVertical: 8,
      height: 56,
      justifyContent: 'center',
    },
    drawerLabel: {
      color: theme.colors.onSurface,
      fontSize: 16,
      marginLeft: 0,
      fontWeight: '600',
    },
    logoutLabel: {
      color: '#FFFFFF',
      fontSize: 16,
      marginLeft: 0,
      fontWeight: '600',
    },
    iconContainer: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderRadius: 10,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.neuLight,
      marginVertical: 16,
      marginHorizontal: 20,
      opacity: 0.5,
    },
  });

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Avatar size="medium" source={require('../../assets/icon.png')} />
        </View>
        <View style={styles.profileInfo}>
          <Typography variant="h6" style={styles.profileName}>User Name</Typography>
          <Typography variant="body2" style={styles.profileEmail}>
            user@example.com
          </Typography>
        </View>
      </View>
      {DrawerItems.map((item, index) => {
        // Special case for logout item
        if (item.isLogout) {
          return (
            <DrawerItem
              key={index}
              label={item.label}
              icon={({ focused }) => (
                <View style={styles.iconContainer}>
                  <Typography
                    variant="body1"
                    style={{
                      opacity: focused ? 1 : 0.7,
                    }}
                  >
                    {item.icon}
                  </Typography>
                </View>
              )}
              onPress={() => {
                // Add logout logic here
                console.log('Logout pressed');
              }}
              style={[styles.drawerItem, { marginTop: 16 }]}
              labelStyle={[styles.drawerLabel, { color: theme.colors.error }]}
              activeBackgroundColor={theme.colors.primaryContainer}
              activeTintColor={theme.colors.error}
              inactiveTintColor={theme.colors.error}
            />
          );
        }
        
        // Regular drawer items
        return (
          <DrawerItem
            key={index}
            label={item.label}
            icon={({ focused }) => (
              <View style={styles.iconContainer}>
                <Typography
                  variant="body1"
                  style={{
                    opacity: focused ? 1 : 0.7,
                  }}
                >
                  {item.icon}
                </Typography>
              </View>
            )}
            onPress={() => props.navigation.navigate(item.route)}
            style={styles.drawerItem}
            labelStyle={styles.drawerLabel}
            activeBackgroundColor={theme.colors.primaryContainer}
            activeTintColor={theme.colors.primary}
            inactiveTintColor={theme.colors.onSurface}
          />
        );
      })}
      <View style={styles.divider} />
    </DrawerContentScrollView>
  );
};
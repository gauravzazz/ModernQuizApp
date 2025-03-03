import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export interface TopicCardProps {
  title: string;
  userCount: number;
  icon?: string;
  onPress?: () => void;
  style?: any;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  title,
  userCount,
  icon,
  onPress,
  style,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness,
      padding: 16,
      marginRight: 16,
      width: 280,
      height: 180,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    icon: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    userCount: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 16,
    },
    userIcon: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {icon && (
          <View style={styles.icon}>
            <Typography color="onPrimary">{icon}</Typography>
          </View>
        )}
        <View style={styles.content}>
          <Typography variant="h6" weight="bold">
            {title}
          </Typography>
        </View>
      </View>
      <View style={styles.userCount}>
        <Typography variant="body2" color="onSurfaceVariant" style={styles.userIcon}>
          👥
        </Typography>
        <Typography variant="body2" color="onSurfaceVariant">
          {userCount} users
        </Typography>
      </View>
      <Button
        label="Start Now"
        onPress={onPress}
        variant="primary"
        size="medium"
        fullWidth
      />
    </View>
  );
};
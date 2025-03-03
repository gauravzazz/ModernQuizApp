import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { ProgressBar } from './ProgressBar';

interface SubjectCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  onPress?: () => void;
  width?: number;
  id?: string;
}

import { addRecentSubject } from '../utils/recentSubjectsStorage';

export const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  description,
  icon,
  progress,
  onPress,
  width,
  id,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      width: width || '100%',
      minHeight: 180,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: 20,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    icon: {
      fontSize: 24,
    },
    content: {
      flex: 1,
      overflow: 'hidden',
    },
    title: {
      marginBottom: 4,
      flexShrink: 1,
    },
    description: {
      opacity: 0.7,
      marginBottom: 4,
    },
    progressContainer: {
      marginTop: 16,
    },
    progressWrapper: {
      flex: 1,
    },
    progressText: {
      marginTop: 8,
    },

  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={async () => {
        try {
          if (id) {
            await addRecentSubject(id);
            console.log(`Subject ${id} added to recent subjects`);
          }
          if (onPress) {
            onPress();
          }
        } catch (error) {
          console.error('Error saving recent subject:', error);
        }
      }}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Typography style={styles.icon}>{icon}</Typography>
        </View>
        <View style={styles.content}>
          <Typography variant="h6" weight="bold" style={styles.title} numberOfLines={1}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="onSurfaceVariant"
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Typography>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} />
          <Typography
            variant="caption"
            color="onSurfaceVariant"
            style={styles.progressText}
          >
            {Math.round(progress * 100)}% Complete
          </Typography>
        </View>
      </View>

    </TouchableOpacity>
  );
};
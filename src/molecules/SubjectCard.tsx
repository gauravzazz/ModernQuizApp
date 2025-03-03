import React from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';

export interface SubjectCardProps {
  title: string;
  description: string;
  progress: number;
  icon?: string;
  backgroundImage?: string;
  onPress?: () => void;
  style?: any;
  width?: number;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  description,
  progress,
  icon,
  backgroundImage,
  onPress,
  style,
  width,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      overflow: 'hidden',
      width: width || 280,
      height: 180,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      marginBottom: 16,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    progressText: {
      marginLeft: 8,
    },
    continueButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    icon: {
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
    content: {
      flex: 1,
    },
    description: {
      marginTop: 4,
      marginBottom: 12,
      opacity: 0.7,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
  });

  const CardContent = () => (
    <>
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
          <Typography
            variant="body2"
            color="onSurfaceVariant"
            style={styles.description}
          >
            {description}
          </Typography>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={{ flex: 1 }}>
          <ProgressBar progress={progress} />
          <Typography
            variant="caption"
            color="onSurfaceVariant"
            style={styles.progressText}
          >
            {`${Math.round(progress * 100)}% Complete`}
          </Typography>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Typography variant="button" color="onPrimary">
            Continue
          </Typography>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
          imageStyle={{
            borderRadius: theme.roundness * 2,
            opacity: 0.15,
            width: '100%',
            height: '100%'
          }}
        >
          <View style={{padding: 20}}>
            <CardContent />
          </View>
        </ImageBackground>
      ) : (
        <View style={{padding: 20}}>
          <CardContent />
        </View>
      )}
    </TouchableOpacity>
  );
};
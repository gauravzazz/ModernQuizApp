import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { QuizConfigModal } from './QuizConfigModal';

interface PopularTopicCardProps {
  title: string;
  questionCount: number;
  icon: string;
  onPress?: () => void;
  width?: number | undefined;
  aspectRatio?: number;
}

export const PopularTopicCard: React.FC<PopularTopicCardProps> = ({
  title,
  questionCount,
  icon,
  onPress,
  width,
  aspectRatio = 1,
}) => {
  const theme = useTheme<AppTheme>();
  const [modalVisible, setModalVisible] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      width: width ? width * 0.90 : 280,
      height: 180,
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      width: '100%',
      gap: 12,
    },
    iconContainer: {
      width: 52,
      height: 52,
      backgroundColor: theme.colors.background,
      borderRadius: 26,
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
      fontSize: 26,
      color: theme.colors.primary,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 8,
    },
    questionCount: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
  });

  const handlePress = () => {
    setModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Typography style={styles.icon}>{icon}</Typography>
          </View>
          <Typography variant="h6" weight="bold" style={styles.title} numberOfLines={1}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="onSurfaceVariant"
            style={styles.questionCount}
          >
            {questionCount} Questions
          </Typography>
        </View>
      </TouchableOpacity>

      <QuizConfigModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={title}
        questionCount={questionCount}
      />
    </>
  );
};
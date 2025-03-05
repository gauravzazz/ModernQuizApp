import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { QuizConfigModal } from './QuizConfigModal';
import { moderateScale, scaledSpacing, scaledIconSize, scaledRadius, scaledFontSize } from '../utils/scaling';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface PopularTopicCardProps {
  title: string;
  questionCount: number;
  icon: string;
  onPress?: () => void;
  width?: number | undefined;
  aspectRatio?: number;
  topicId?: string;
  backgroundImage?: string;
}

export const PopularTopicCard: React.FC<PopularTopicCardProps> = ({
  title,
  questionCount,
  icon,
  onPress,
  width,
  aspectRatio = 1,
  topicId,
  backgroundImage,
}) => {
  const theme = useTheme<AppTheme>();
  const [modalVisible, setModalVisible] = React.useState(false);
  const isSmallScreen = SCREEN_WIDTH < 360;

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.4)',
      borderRadius: scaledRadius(theme.roundness * 2),
    },
    contentContainer: {
      padding: scaledSpacing(isSmallScreen ? 8 : 20),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: width ? width * 1 : moderateScale(280),
      height: moderateScale(isSmallScreen ? 160 : 180),
      backgroundColor: backgroundImage ? 'transparent' : theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: backgroundImage ? 0 : scaledSpacing(isSmallScreen ? 16 : 20),
      overflow: 'hidden',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: theme.dark ? 0.6 : 0.4,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
      width: '100%',
      gap: scaledSpacing(isSmallScreen ? 8 : 12),
    },
    iconContainer: {
      width: moderateScale(isSmallScreen ? 40 : 46),
      height: moderateScale(isSmallScreen ? 40 : 46),
      backgroundColor: backgroundImage ? 'rgba(255,255,255,0.9)' : theme.colors.background,
      borderRadius: moderateScale(isSmallScreen ? 20 : 23),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: theme.dark ? 0.4 : 0.3,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
    },
    icon: {
      fontSize: scaledIconSize(isSmallScreen ? 8 : 22),
      color: theme.colors.primary,
    },
    title: {
      color: backgroundImage ? '#FFFFFF' : theme.colors.onSurface,
      textShadowColor: backgroundImage ? 'rgba(0,0,0,0.5)' : 'transparent',
      textShadowOffset: backgroundImage ? { width: 1, height: 1 } : { width: 0, height: 0 },
      textShadowRadius: backgroundImage ? 3 : 0,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: scaledSpacing(1),
      fontSize: scaledFontSize(isSmallScreen ? 4 : 14),
    },
    questionCount: {
      color: backgroundImage ? 'rgba(255,255,255,0.9)' : theme.colors.onSurfaceVariant,
      textShadowColor: backgroundImage ? 'rgba(0,0,0,0.3)' : 'transparent',
      textShadowOffset: backgroundImage ? { width: 0.5, height: 0.5 } : { width: 0, height: 0 },
      textShadowRadius: backgroundImage ? 1 : 0,
      textAlign: 'center',
      fontSize: scaledFontSize(isSmallScreen ? 4 : 12),
    },
  });

  const handlePress = () => {
    setModalVisible(true);
  };

  const CardContent = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Typography style={styles.icon}>{icon}</Typography>
      </View>
      <Typography variant="h6" weight="bold" style={styles.title} numberOfLines={1}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color={backgroundImage ? "onPrimary" : "onSurfaceVariant"}
        style={styles.questionCount}
      >
        {questionCount} Questions
      </Typography>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {backgroundImage ? (
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.backgroundImage}
            imageStyle={{
              borderRadius: scaledRadius(theme.roundness * 2),
              opacity: 0.75,
            }}
            resizeMode="cover"
          >
            <View style={styles.gradientOverlay} />
            <View style={styles.contentContainer}>
              <CardContent />
            </View>
          </ImageBackground>
        ) : (
          <CardContent />
        )}
      </TouchableOpacity>

      <QuizConfigModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={title}
        questionCount={questionCount}
        topicId={topicId}
      />
    </>
  );
};
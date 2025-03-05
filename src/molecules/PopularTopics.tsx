import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { PopularTopicCard } from '../atoms/PopularTopicCard';
import { Typography } from '../atoms/Typography';
import { moderateScale, scaledSpacing } from '../utils/scaling';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = scaledSpacing(12);
const HORIZONTAL_PADDING = scaledSpacing(8);
const CARD_WIDTH = (SCREEN_WIDTH - (2 * HORIZONTAL_PADDING) - GRID_SPACING) / 2;

interface Topic {
  id: string;
  title: string;
  questionCount: number;
  icon: string;
  image?: string;
}

interface PopularTopicsProps {
  topics: Topic[];
  onTopicPress?: (topicId: string) => void;
  onShowMorePress?: () => void;
}

export const PopularTopics: React.FC<PopularTopicsProps> = ({
  topics,
  onTopicPress,
  onShowMorePress,
}) => {
  const theme = useTheme<AppTheme>();
  const [showAll, setShowAll] = useState(false);
  const visibleTopics = showAll ? topics : topics.slice(0, 6);

  const styles = StyleSheet.create({
    container: {
      marginTop: scaledSpacing(16),
      paddingHorizontal: HORIZONTAL_PADDING,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaledSpacing(20),
      gap: scaledSpacing(8),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'flex-start',
    },
    cardWrapper: {
      width: '50%',
      paddingHorizontal: GRID_SPACING/2,
      marginBottom: scaledSpacing(16),
      alignItems: 'center',
    },
    showMoreButton: {
      width: 'auto',
      minWidth: moderateScale(160),
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: scaledSpacing(16),
      borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    showMoreContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: scaledSpacing(16),
      marginBottom: scaledSpacing(8),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h5" weight="bold">
          ⭐ Popular Topics
        </Typography>
      </View>
      <View style={styles.grid}>
        {visibleTopics.map((topic) => (
          <View key={topic.id} style={styles.cardWrapper}>
            <PopularTopicCard
              title={topic.title}
              questionCount={topic.questionCount}
              icon={topic.icon}
              onPress={() => onTopicPress?.(topic.id)}
              width={CARD_WIDTH * 0.95}
              topicId={topic.id}
              backgroundImage={topic.image}
            />
          </View>
        ))}
      </View>
      {topics.length > 6 && (
        <View style={styles.showMoreContainer}>
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => {
              setShowAll(!showAll);
              onShowMorePress?.();
            }}
            activeOpacity={0.8}
          >
            <Typography
              variant="body1"
              weight="medium"
              color="primary"
            >
              {showAll ? 'Show Less' : `Show More (${topics.length - 6} more)`}
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
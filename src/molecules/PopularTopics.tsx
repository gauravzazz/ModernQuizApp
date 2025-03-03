import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { PopularTopicCard } from '../atoms/PopularTopicCard';
import { Typography } from '../atoms/Typography';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (3 * GRID_SPACING)) / 2;

interface Topic {
  id: string;
  title: string;
  questionCount: number;
  icon: string;
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
      padding: GRID_SPACING,
      flex: 1,
    },
    header: {
      marginBottom: 24,
      paddingHorizontal: 4,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginHorizontal: -GRID_SPACING/2,
      width: '100%',
      alignItems: 'flex-start',
    },
    cardWrapper: {
      width: '50%',
      paddingHorizontal: GRID_SPACING/2,
      marginBottom: GRID_SPACING * 1.5,
    },
    showMoreButton: {
      width: 'auto',
      minWidth: 160,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    showMoreContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 8,
      paddingHorizontal: 4,
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
              width={CARD_WIDTH}
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
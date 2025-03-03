import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { SubjectCard } from './SubjectCard';

interface Topic {
  id: string;
  title: string;
  description?: string;
  icon: string;
  progress?: number;
}

interface RecentTopicsProps {
  topics: Topic[];
  onTopicPress?: (topicId: string) => void;
}

export const RecentTopics: React.FC<RecentTopicsProps> = ({
  topics,
  onTopicPress,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 32,
    },
    sectionTitle: {
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    scrollView: {
      marginHorizontal: -10,
      paddingHorizontal: 10,
    },
    cardContainer: {
      width: 280,
      marginRight: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <Typography variant="h5" weight="bold">
          🔥 Recent Topics
        </Typography>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {topics.map((topic) => (
          <View key={topic.id} style={styles.cardContainer}>
            <SubjectCard
              title={topic.title}
              description={topic.description?? ''}
              progress={topic.progress? topic.progress : 0}
              icon={topic.icon}
              onPress={() => onTopicPress?.(topic.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
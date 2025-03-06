import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { TopicCard } from './TopicCard';
import { mockTopics } from '../data/mockData';
import { QuizConfigModal } from '../atoms/QuizConfigModal';

export const HotTopics: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const theme = useTheme<AppTheme>();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedTopic, setSelectedTopic] = React.useState<any>(null);
  const [questionCount, setQuestionCount] = React.useState(5);
  const [quizMode, setQuizMode] = React.useState<'Practice' | 'Test'>('Practice');

  const filteredTopics = React.useMemo(() => {
    if (!searchQuery) return mockTopics;
    const query = searchQuery.toLowerCase();
    return mockTopics.filter(topic =>
      topic.title.toLowerCase().includes(query) ||
      (topic.description?.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 32,
    },
    sectionTitle: {
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 10,
    },
    scrollView: {
      marginHorizontal: -10,
      paddingHorizontal: 10,
    },
  });

  const handleTopicPress = (topic: any) => {
    setSelectedTopic(topic);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <Typography variant="h5" weight="bold">
          🔥 Hot Topics
        </Typography>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            title={topic.title}
            userCount={topic.userCount ? topic.userCount : 0}
            icon={topic.icon}
            onPress={() => handleTopicPress(topic)}
          />
        ))}
      </ScrollView>

      <QuizConfigModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              initialQuestionCount={questionCount}
              initialMode={quizMode}
              onStart={({ questionCount: count, mode }) => {
                  setQuestionCount(count);
                  setQuizMode(mode);
                  // Add your quiz start logic here
              } } title={''} questionCount={0}      />
    </View>
  );
};
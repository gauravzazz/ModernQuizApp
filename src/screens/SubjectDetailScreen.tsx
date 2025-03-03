import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AppTheme } from '../theme';
import { SubjectHeader } from '../molecules/SubjectHeader';
import { SubjectDescription } from '../molecules/SubjectDescription';
import { RecentTopics } from '../molecules/RecentTopics';
import { TopicsGrid } from '../molecules/TopicsGrid';
import { QuizConfigModal } from '../atoms/QuizConfigModal';
import { Typography } from '../atoms/Typography';

import { Topic, mockMathTopics } from '../data/mockData';
import { addRecentTopic, fetchRecentTopics } from '../utils/recentTopicsStorage';

interface GridTopic extends Pick<Topic, 'id' | 'title' | 'icon' | 'questionCount'> {}

const mockRecentTopics = mockMathTopics.slice(0, 3);
const mockAllTopics: GridTopic[] = mockMathTopics;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SubjectDetailScreenProps = {
  route: { params: { subjectId: string; title: string } };
};

export const SubjectDetailScreen: React.FC<SubjectDetailScreenProps> = ({ route }) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    scrollContainer: {
      flexGrow: 1,
    },
  });

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedTopicId, setSelectedTopicId] = React.useState<string>('');
  const [recentTopics, setRecentTopics] = React.useState<Topic[]>([]);

  React.useEffect(() => {
    loadRecentTopics();
  }, []);

  const loadRecentTopics = async () => {
    const topics = await fetchRecentTopics(route.params.subjectId);
    setRecentTopics(topics);
  };

  const handleTopicPress = async (topicId: string) => {
    console.log('[handleTopicPress] Selected topic ID:', topicId);
    console.log('[handleTopicPress] Current subject ID:', route.params.subjectId);
    
    setSelectedTopicId(topicId);
    try {
      console.log('[handleTopicPress] Attempting to add topic to recent topics...');
      await addRecentTopic(route.params.subjectId, topicId);
      console.log('[handleTopicPress] Successfully added topic to recent topics');
      
      await loadRecentTopics();
      console.log('[handleTopicPress] Successfully reloaded recent topics');
      
      // Move this inside the try block to ensure it only happens after successful operations
      setModalVisible(true);
      console.log('[handleTopicPress] Modal opened after adding to recent topics');
    } catch (error) {
      console.error('[handleTopicPress] Error:', error);
      // Still show the modal even if there was an error with the recent topics
      setModalVisible(true);
      console.log('[handleTopicPress] Modal opened despite error with recent topics');
    }
  };

  const handleQuizStart = (config: { questionCount: number; mode: 'Practice' | 'Test' }) => {
    console.log(`Starting quiz for topic ${selectedTopicId}:`, config);
    // Navigation logic would go here
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SubjectHeader title={route.params.title} onBack={handleBackPress} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {recentTopics.length > 0 ? (
          <RecentTopics 
            topics={recentTopics} 
            onTopicPress={handleTopicPress} 
          />
        ) : (
          <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
            <Typography variant="body1" color="onSurfaceVariant">
              This subject is new to you. Start exploring topics below!
            </Typography>
          </View>
        )}
        
        <TopicsGrid 
          topics={mockAllTopics} 
          onTopicPress={handleTopicPress} 
        />
      </ScrollView>

      <QuizConfigModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStart={handleQuizStart}
        initialQuestionCount={5}
        initialMode="Practice"
        title={mockAllTopics.find(t => t.id === selectedTopicId)?.title || ''}
        questionCount={mockAllTopics.find(t => t.id === selectedTopicId)?.questionCount || 0}
      />
    </View>
  );
};
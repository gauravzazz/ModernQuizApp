import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Animated, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AppTheme } from '../theme';
import { SubjectHeader } from '../molecules/SubjectHeader';
import { SubjectDescription, SubjectSearchBar } from '../molecules/SubjectDescription';
import { RecentTopics } from '../molecules/RecentTopics';
import { TopicsGrid } from '../molecules/TopicsGrid';
import { QuizConfigModal } from '../atoms/QuizConfigModal';
import { Typography } from '../atoms/Typography';

import { Topic, mockMathTopics, mockSubjects } from '../data/mockData';
import { addRecentTopic, fetchRecentTopics } from '../utils/recentTopicsStorage';

interface GridTopic extends Pick<Topic, 'id' | 'title' | 'icon' | 'questionCount'> {}

const mockRecentTopics = mockMathTopics.slice(0, 3);
const mockAllTopics: GridTopic[] = mockMathTopics;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SubjectDetailRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;

// Remove the explicit props interface since we'll use hooks to get the route
export const SubjectDetailScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SubjectDetailRouteProp>();
  const { subjectId, title } = route.params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    stickySearchContainer: {
      position: 'absolute',
      top: 60, // Position below the header
      left: 16,
      right: 16,
      zIndex: 10,
    },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStickySearch, setShowStickySearch] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const subjectCardHeight = screenHeight * 0.45; // Match the height in SubjectDescription

  // Load recent topics when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('[SubjectDetailScreen] Screen focused, loading recent topics');
      loadRecentTopics();
      return () => {};
    }, [subjectId])
  );

  React.useEffect(() => {
    // Initial load of recent topics
    loadRecentTopics();
    
    // Set up listener for scroll position
    const scrollListener = scrollY.addListener(({ value }) => {
      // When scroll position exceeds 70% of the card height, show sticky search
      setShowStickySearch(value > subjectCardHeight * 0.7);
    });
    
    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, []);

  const loadRecentTopics = async () => {
    console.log('[loadRecentTopics] Loading topics for subject:', subjectId);
    const topics = await fetchRecentTopics(subjectId);
    console.log('[loadRecentTopics] Loaded topics:', topics);
    setRecentTopics(topics);
  };

  const handleTopicPress = async (topicId: string) => {
    console.log('[handleTopicPress] Selected topic ID:', topicId);
    console.log('[handleTopicPress] Current subject ID:', subjectId);
    
    // Set the selected topic ID first
    setSelectedTopicId(topicId);
    
    try {
      console.log('[handleTopicPress] Attempting to add topic to recent topics...');
      // Directly await the addRecentTopic operation
      await addRecentTopic(subjectId, topicId);
      console.log('[handleTopicPress] Successfully added topic to recent topics');
      
      // Reload recent topics after adding
      await loadRecentTopics();
      console.log('[handleTopicPress] Successfully reloaded recent topics');
      
      // Show modal immediately after operations complete
      setModalVisible(true);
      console.log('[handleTopicPress] Modal opened after adding to recent topics');
    } catch (error) {
      console.error('[handleTopicPress] Error handling topic:', error);
      // Show modal even if there was an error
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

  // Create a subject object for the SubjectDescription component
  const subjectData = {
    icon: mockAllTopics.find(t => t.id === subjectId)?.icon || 'book',
    iconType: 'emoji' as 'emoji', // Explicitly type as 'emoji' literal type
    title: title,
    description: 'Explore various topics and test your knowledge with quizzes.',
    topicsCount: mockAllTopics.length,
    questionsCount: mockAllTopics.reduce((total, topic) => total + (topic.questionCount || 0), 0),
    progress: 0, // This could be calculated based on completed quizzes
    accuracy: 85, // This could be calculated based on quiz results
    backgroundImage: mockSubjects.find(s => s.id === subjectId)?.image, // Pass the background image from the subject
  };

  // Function to handle search in the subject description
  const [filteredRecentTopics, setFilteredRecentTopics] = useState<Topic[]>([]);
  const [filteredAllTopics, setFilteredAllTopics] = useState<GridTopic[]>(mockAllTopics);
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Filter recent topics
    const filteredRecent = recentTopics.filter(topic =>
      topic.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecentTopics(filteredRecent);
    
    // Filter all topics
    const filteredAll = mockAllTopics.filter(topic =>
      topic.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAllTopics(filteredAll);
  };

  return (
    <View style={styles.container}>
      <SubjectHeader title={title} onBack={handleBackPress} />
      
      {/* Show sticky search bar when scrolled */}
      {showStickySearch && (
        <View style={styles.stickySearchContainer}>
          <SubjectSearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
        </View>
      )}
      
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}> 
        <SubjectDescription 
          subject={subjectData}
          onSearchChange={handleSearchChange}
          showSearchBar={!showStickySearch}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          height={subjectCardHeight}
        />
        {recentTopics.length > 0 ? (
          <RecentTopics 
            topics={searchQuery ? filteredRecentTopics : recentTopics} 
            onTopicPress={handleTopicPress} 
          />
        ) : (
          <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
            <Typography variant="body1" color="onSurfaceVariant">
              {searchQuery && filteredAllTopics.length === 0
                ? "No topics match your search"
                : "This subject is new to you. Start exploring topics below!"}
            </Typography>
          </View>
        )}
        
        <TopicsGrid 
          topics={searchQuery ? filteredAllTopics : mockAllTopics} 
          onTopicPress={handleTopicPress} 
        />
      </Animated.ScrollView>

      <QuizConfigModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStart={handleQuizStart}
        initialQuestionCount={5}
        initialMode="Practice"
        title={mockAllTopics.find(t => t.id === selectedTopicId)?.title || ''}
        questionCount={mockAllTopics.find(t => t.id === selectedTopicId)?.questionCount || 0}
        topicId={selectedTopicId}
        subjectId={subjectId}
      />
    </View>
  );
};
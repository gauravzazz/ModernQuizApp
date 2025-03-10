import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { HeaderSection } from '../molecules/HeaderSection';
import { mockSubjects, mockTopics } from '../data/mockData';
import { RecentSubjects } from '../molecules/RecentSubjects';
import { PopularTopics } from '../molecules/PopularTopics';
import { HotTopics } from '../molecules/HotTopics';
import { BottomNavigation } from '../molecules/BottomNavigation';
import { SubjectGrid } from '../molecules/SubjectGrid';
import { RootStackParamList } from '../navigation';

import { Typography } from '../atoms/Typography';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();

  const [activeTab, setActiveTab] = React.useState('home');
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = React.useMemo(() => {
    if (!searchQuery) return mockSubjects;
    const query = searchQuery.toLowerCase();
    return mockSubjects.filter(subject =>
      subject.title.toLowerCase().includes(query) ||
      subject.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredTopics = React.useMemo(() => {
    if (!searchQuery) return mockTopics;
    const query = searchQuery.toLowerCase();
    return mockTopics.filter(topic =>
      (topic?.title?.toLowerCase().includes(query) ||
       topic?.description?.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 140,
      paddingHorizontal: 10,
    },
    searchContainer: {
      marginBottom: 24,
      paddingHorizontal: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },

    sectionTitle: {
      marginBottom: 16,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    topicsContainer: {
      marginBottom: 32,
    },
    topicsScroll: {
      marginHorizontal: -16,
      paddingHorizontal: 16,
    },
    noResultsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 48,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      margin: 16,
    },
    noResultsEmoji: {
      fontSize: 48,
      marginBottom: 16,
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    noResultsTitle: {
      marginBottom: 8,
      textAlign: 'center',
    },
    noResultsText: {
      textAlign: 'center',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <HeaderSection
        onAvatarPress={() => navigation.navigate('Settings')}
        onNotificationPress={() => {}}
        notificationCount={3}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ScrollView style={styles.container}>


        {searchQuery && filteredSubjects.length === 0 && filteredTopics.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Typography variant="h5" weight="bold" style={styles.noResultsEmoji}>
              🔍
            </Typography>
            <Typography variant="h6" weight="bold" style={styles.noResultsTitle}>
              No Results Found
            </Typography>
            <Typography
              variant="body1"
              color="onSurfaceVariant"
              style={styles.noResultsText}
            >
              We couldn't find any matches for "{searchQuery}"
            </Typography>
          </View>
        ) : (
          <>
            {(!searchQuery || filteredSubjects.length > 0) && (
              <RecentSubjects key={refreshKey} searchQuery={searchQuery} />
            )}
            
            <HotTopics searchQuery={searchQuery} />

            {(!searchQuery || filteredSubjects.length > 0) && (
              <SubjectGrid
                subjects={filteredSubjects}
                onSubjectPress={(id) => {
                  const subject = filteredSubjects.find(s => s.id === id);
                  navigation.navigate('SubjectDetail', { 
                    subjectId: id,
                    title: subject?.title || 'Subject'
                  });
                }}
              />
            )}

            {(!searchQuery || filteredTopics.length > 0) && (
              <PopularTopics
                topics={filteredTopics}
                onTopicPress={(id) => {
                  const topic = filteredTopics.find(t => t.id === id);
                  navigation.navigate('SubjectDetail', { 
                    subjectId: id,
                    title: topic?.title || 'Topic'
                  });
                }}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};
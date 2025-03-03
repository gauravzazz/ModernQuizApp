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
import { SideBar } from '../atoms/SideBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      // Increment the refresh key to force RecentSubjects to re-render
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 140, // Increased padding to account for fixed header height
      paddingHorizontal: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    searchContainer: {
      marginBottom: 32,
    },
    sectionTitle: {
      marginBottom: 16,
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
  });

  return (
    <View style={{ flex: 1 }}>
      <HeaderSection
        onAvatarPress={() => setSidebarVisible(true)}
        onNotificationPress={() => {}}
        notificationCount={3}
      />
      <ScrollView style={styles.container}>
        <SideBar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />

        <RecentSubjects key={refreshKey} />
        <HotTopics />

        <SubjectGrid
          subjects={mockSubjects}
          onSubjectPress={(id) => navigation.navigate('SubjectDetail', { subjectId: id })}
        />

        <PopularTopics
          topics={mockTopics}
          onTopicPress={(id) => navigation.navigate('SubjectDetail', { subjectId: id })}
        />
      </ScrollView>
      {/* <BottomNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
      /> */}
    </View>
  );
};
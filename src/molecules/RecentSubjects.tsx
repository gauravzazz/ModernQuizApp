import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { SubjectCard } from './SubjectCard';
import { mockSubjects } from '../data/mockData';
import { fetchRecentSubjects } from '../utils/recentSubjectsStorage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RecentSubjects: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NavigationProp>();
  const [recentSubjects, setRecentSubjects] = useState(mockSubjects);

  useEffect(() => {
    const loadRecentSubjects = async () => {
      try {
        const subjects = await fetchRecentSubjects();
        setRecentSubjects(subjects);
      } catch (error) {
        console.error('Error loading recent subjects:', error);
      }
    };

    loadRecentSubjects();
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 32,
      marginTop: 16,
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
    cardContainer: {
      width: 280,
      marginRight: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitle}>
        <Typography variant="h5" weight="bold">
          📚 Recent Subjects
        </Typography>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {recentSubjects.length > 0 ? (
          recentSubjects.map((subject) => (
            <View key={subject.id} style={styles.cardContainer}>
              <SubjectCard
                title={subject.title}
                description={subject.description}
                progress={subject.progress}
                icon={subject.icon}
                onPress={() => navigation.navigate('SubjectDetail', { 
                  subjectId: subject.id,
                  title: subject.title 
                })}
                backgroundImage={subject.image}
                id={subject.id}
              />
            </View>
          ))
        ) : (
          <View style={[styles.cardContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Typography variant="body1" color="onSurfaceVariant">
              No Recent Subjects
            </Typography>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
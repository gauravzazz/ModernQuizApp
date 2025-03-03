import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import {SubjectCard } from '../atoms/SubjectCard';
import { Typography } from '../atoms/Typography';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (3 * GRID_SPACING)) / 2;

interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
}

interface SubjectGridProps {
  subjects: Subject[];
  onSubjectPress?: (subjectId: string) => void;
  onShowMorePress?: () => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  subjects,
  onSubjectPress,
  onShowMorePress,
}) => {
  const theme = useTheme<AppTheme>();
  const [showAll, setShowAll] = useState(false);
  const visibleSubjects = showAll ? subjects : subjects.slice(0, 6);

  const styles = StyleSheet.create({
    container: {
      marginTop: 32,
      paddingHorizontal: GRID_SPACING,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      gap: 8,
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
    showMoreContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 8,
      paddingHorizontal: 4,
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h5" weight="bold">
          📚 Subjects
        </Typography>
      </View>
      <View style={styles.grid}>
        {visibleSubjects.map((subject) => (
          <View key={subject.id} style={styles.cardWrapper}>
            <SubjectCard
              title={subject.title}
              description={subject.description}
              icon={subject.icon}
              progress={subject.progress}
              onPress={() => onSubjectPress?.(subject.id)}
              id={subject.id}
            />
          </View>
        ))}
      </View>
      {subjects.length > 6 && (
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
              {showAll ? 'Show Less' : `Show More (${subjects.length - 6} more)`}
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
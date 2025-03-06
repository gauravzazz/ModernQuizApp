import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { SubjectCard } from '../atoms/SubjectCard';
import { Typography } from '../atoms/Typography';
import { moderateScale, scaledSpacing } from '../utils/scaling';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SPACING = scaledSpacing(16);
const HORIZONTAL_PADDING = scaledSpacing(8);
const CARD_WIDTH = (SCREEN_WIDTH - (2 * HORIZONTAL_PADDING) - GRID_SPACING) / 2;

interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  image?: string;
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
      marginTop: scaledSpacing(24),
      paddingHorizontal: HORIZONTAL_PADDING,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaledSpacing(16),
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
      width: '48%',
      paddingHorizontal: GRID_SPACING/2,
      marginBottom: GRID_SPACING,
      alignItems: 'center',
    },
    showMoreContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: scaledSpacing(16),
      marginBottom: scaledSpacing(8),
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
              backgroundImage={subject.image}
              onPress={() => onSubjectPress?.(subject.id)}
              id={subject.id}
              width={CARD_WIDTH}
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
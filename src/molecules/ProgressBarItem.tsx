import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { AppTheme } from '../theme';
import { moderateScale, scaledSpacing, verticalScale } from '../utils/scaling';

interface ProgressBarItemProps {
  title: string;
  value: number;
  maxValue: number;
  leftCaption?: string;
  rightCaption?: string;
  bottomLeftCaption?: string;
  bottomRightCaption?: string;
}

export const ProgressBarItem: React.FC<ProgressBarItemProps> = ({
  title,
  value,
  maxValue,
  leftCaption,
  rightCaption,
  bottomLeftCaption,
  bottomRightCaption,
}) => {
  const theme = useTheme<AppTheme>();
  const progress = Math.min(value / maxValue, 1);

  const styles = StyleSheet.create({
    progressItem: {
      marginBottom: scaledSpacing(16),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 1.2,
      padding: moderateScale(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.25,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(5),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
    },
    progressLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(8),
      alignItems: 'center',
    },
    progressBarContainer: {
      marginBottom: verticalScale(6),
      height: moderateScale(8),
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: moderateScale(4),
      overflow: 'hidden',
    },
    bottomCaptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scaledSpacing(8),
    },
  });

  return (
    <View style={styles.progressItem}>
      <View style={styles.progressLabel}>
        <Typography weight="bold">{title}</Typography>
        {leftCaption && rightCaption ? (
          <Typography weight="bold">{rightCaption}</Typography>
        ) : null}
      </View>
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} />
      </View>
      {(bottomLeftCaption || bottomRightCaption) && (
        <View style={styles.bottomCaptions}>
          {bottomLeftCaption && <Typography variant="caption">{bottomLeftCaption}</Typography>}
          {bottomRightCaption && <Typography variant="caption">{bottomRightCaption}</Typography>}
        </View>
      )}
    </View>
  );
};
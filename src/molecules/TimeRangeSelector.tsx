import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { moderateScale, scaledRadius, scaledSpacing } from '../utils/scaling';

export type TimeRange = 'week' | 'month' | 'all';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    timeRangeSelector: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: scaledSpacing(16),
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: scaledSpacing(4),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: 4,
    },
    timeRangeButton: {
      paddingVertical: scaledSpacing(8),
      paddingHorizontal: scaledSpacing(16),
      borderRadius: scaledRadius(theme.roundness),
    },
    timeRangeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    timeRangeButtonText: {
      color: theme.colors.onSurface,
    },
    timeRangeButtonTextActive: {
      color: theme.colors.onPrimary,
    },
  });

  return (
    <View style={styles.timeRangeSelector}>
      {(['week', 'month', 'all'] as TimeRange[]).map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.timeRangeButtonActive,
          ]}
          onPress={() => onTimeRangeChange(range)}
        >
          <Typography
            style={[
              styles.timeRangeButtonText,
              timeRange === range && styles.timeRangeButtonTextActive,
            ]}
          >
            {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};
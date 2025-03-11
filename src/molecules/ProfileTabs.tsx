import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { moderateScale, scale, verticalScale } from '../utils/scaling';

interface ProfileTabsProps {
  activeTab: 'stats' | 'awards';
  onTabChange: (tab: 'stats' | 'awards') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: verticalScale(24),
      backgroundColor: theme.colors.neuDark,
      borderRadius: theme.roundness * 1.5,
      padding: moderateScale(4),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(6),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
    },
    tab: {
      flex: 1,
      paddingVertical: verticalScale(12),
      alignItems: 'center',
      borderRadius: theme.roundness - 2,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(2), height: moderateScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: moderateScale(4),
    },
    tabText: {
      fontWeight: '600',
      fontSize: moderateScale(16),
      color: '#FFFFFF',
    },
    activeTabText: {
      color: theme.colors.onPrimary,
    },
  });

  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
        onPress={() => onTabChange('stats')}
        activeOpacity={0.8}
      >
        <Typography 
          style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}
        >
          Statistics
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'awards' && styles.activeTab]}
        onPress={() => onTabChange('awards')}
        activeOpacity={0.8}
      >
        <Typography 
          style={[styles.tabText, activeTab === 'awards' && styles.activeTabText]}
        >
          Awards
        </Typography>
      </TouchableOpacity>
    </View>
  );
};
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 85,
      backgroundColor: theme.colors.neuPrimary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 20,
      borderTopWidth: 1.5,
      borderTopColor: theme.colors.neuLight,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 20,
    },
    tabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 52,
      borderRadius: theme.roundness,
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    activeTab: {
      backgroundColor: theme.colors.neuLight,
      borderColor: theme.colors.neuLight,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 8,
    },
    quizButton: {
      backgroundColor: theme.colors.primary,
      width: 65,
      height: 65,
      borderRadius: 32.5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 35,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.neuLight,
      transform: [{ scale: 1.1 }],
    },
    icon: {
      fontSize: 26,
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  });

  const tabs = [
    { name: 'home', icon: '🏠' },
    { name: 'stats', icon: '📊' },
    { name: 'quiz', icon: '⚡' },
    { name: 'bookmarks', icon: '🔖' },
    { name: 'profile', icon: '👤' },
  ];

  const renderTab = (tab: { name: string; icon: string }, index: number) => {
    const isActive = activeTab === tab.name;
    const isQuizTab = tab.name === 'quiz';

    if (isQuizTab) {
      return (
        <TouchableOpacity
          key={tab.name}
          style={styles.quizButton}
          onPress={() => onTabPress(tab.name)}
          activeOpacity={0.8}
        >
          <Typography color="onPrimary" style={styles.icon}>
            {tab.icon}
          </Typography>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={tab.name}
        style={[styles.tabButton, isActive && styles.activeTab]}
        onPress={() => onTabPress(tab.name)}
        activeOpacity={0.8}
      >
        <Typography
          color={isActive ? 'primary' : 'onSurfaceVariant'}
          style={styles.icon}
        >
          {tab.icon}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => renderTab(tab, index))}
    </View>
  );
};
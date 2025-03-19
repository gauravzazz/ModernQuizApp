import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Dimensions, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { Button } from '../atoms/Button';
import { NavigationButton } from '../atoms/NavigationButton';
import { ProfileHeader } from '../molecules/ProfileHeader';
import { ProfileStats } from '../molecules/ProfileStats';
import { ProfileTabs } from '../molecules/ProfileTabs';
import { ProfileAwards } from '../molecules/ProfileAwards';

import { saveUserProfile } from '../services/profileService';
import { useProfileData } from '../hooks/useProfileData';
import { registerAnalyticsListener, unregisterAnalyticsListener } from '../services/analyticsService';
import { UserProfile } from '../types/profile';
import { moderateScale, scale, scaledRadius, verticalScale } from '../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { profile, loading, error, refreshProfile } = useProfileData();
  const [activeTab, setActiveTab] = useState<'stats' | 'awards'>('stats');
  
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by the AuthNavigator in App.tsx
            } catch (error) {
              console.error('Error signing out:', error);
            }
          } 
        },
      ]
    );
  };

  // Register for analytics updates to refresh profile when quiz data changes
  useEffect(() => {
    // Create a listener function that will refresh profile data
    const handleAnalyticsUpdate = () => {
      refreshProfile();
    };
    
    // Register the listener
    registerAnalyticsListener(handleAnalyticsUpdate);
    
    // Clean up listener when component unmounts
    return () => {
      unregisterAnalyticsListener(handleAnalyticsUpdate);
    };
  }, [refreshProfile]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: StatusBar.currentHeight || 0,
    },
    header: {
      marginBottom: verticalScale(8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(16),
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      //paddingVertical: verticalScale(16),
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
    },
    sectionTitle: {
      marginBottom: verticalScale(16),
      fontWeight: '700',
      fontSize: moderateScale(20),
      color: theme.colors.primary,
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(0.5), height: moderateScale(0.5) },
      textShadowRadius: moderateScale(1),
      paddingLeft: scale(4),
    },
    progressSection: {
      marginBottom: verticalScale(28),
    },
    progressItem: {
      marginBottom: verticalScale(20),
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
      marginBottom: verticalScale(12),
      alignItems: 'center',
    },
    progressBarContainer: {
      marginBottom: verticalScale(6),
      height: moderateScale(8),
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: scaledRadius(4),
      overflow: 'hidden',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: moderateScale(24),
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Typography>Loading profile...</Typography>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Typography>Could not load profile data</Typography>
        <Button 
          label="Try Again" 
          onPress={() => setLoading(true)} 
          style={{ marginTop: verticalScale(16) }}
        />
      </View>
    );
  }

  const renderStatsTab = () => (
    <View>
      <View style={styles.progressSection}>
        <Typography variant="h6" style={styles.sectionTitle}>Quiz Performance</Typography>
        
        <View style={styles.progressItem}>
          <View style={styles.progressLabel}>
            <Typography>Overall Accuracy</Typography>
            <Typography weight="bold">0%</Typography>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={0} />
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Typography variant="h6" style={styles.sectionTitle}>Activity</Typography>
        
        <View style={styles.progressItem}>
          <View style={styles.progressLabel}>
            <Typography>Daily Streak</Typography>
            <Typography weight="bold">{profile.stats.streak} days</Typography>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={Math.min(profile.stats.streak / 30, 1)} />
          </View>
        </View>
        
        <View style={styles.progressItem}>
          <View style={styles.progressLabel}>
            <Typography>Weekly Goal</Typography>
            <Typography weight="bold">{profile.stats.weeklyQuizzes}/10 quizzes</Typography>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={profile.stats.weeklyQuizzes / 10} />
          </View>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <Button 
          label="Sign Out" 
          variant="outline" 
          onPress={handleSignOut} 
          fullWidth 
        />
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <NavigationButton 
          variant="left" 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="h4" weight="bold">
          Profile
        </Typography>
      </View>
      
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        avatar={profile.avatar}
        level={profile.level}
        onEditPress={() => console.log('Edit profile')}
        onProfileUpdate={async (data) => {
          try {
            if (!profile) return;
            
            const updatedProfile = {
              ...profile,
              name: data.name || profile.name,
              avatar: data.avatar || profile.avatar
            };
            
            await saveUserProfile(updatedProfile);
            refreshProfile(); // Trigger profile reload
          } catch (error) {
            console.error('Error updating profile:', error);
          }
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileStats
          stats={{
            totalQuizzes: profile.stats.totalQuizzes,
            correctAnswers: profile.stats.correctAnswers,
            totalTime: profile.stats.totalTime,
            xp: profile.stats.xp,
            awards: profile.awards.filter(a => a.unlocked).length
          }}
        />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'stats' ? renderStatsTab() : (
          <ProfileAwards awards={profile.awards} />
        )}
      </ScrollView>
    </View>
  );
};
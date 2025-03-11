import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProgressBar } from '../atoms/ProgressBar';
import { Button } from '../atoms/Button';
import { NavigationButton } from '../atoms/NavigationButton';
import { ProfileHeader } from '../molecules/ProfileHeader';
import { ProfileStats } from '../molecules/ProfileStats';
import { ProfileTabs } from '../molecules/ProfileTabs';
import { ProfileAwards } from '../molecules/ProfileAwards';

import { getUserProfile, saveUserProfile } from '../services/profileService';
import { UserProfile, UserAward } from '../types/profile';
import { moderateScale, scale, scaledRadius, verticalScale } from '../utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshProfile, setRefreshProfile] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'awards'>('stats');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [refreshProfile]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: StatusBar.currentHeight || 0,
    },
    headerNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
      zIndex: 10,
      borderBottomWidth: 0,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 0, height: moderateScale(4) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(8),
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
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
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.headerNav}>
        <View style={styles.headerTitle}>
          <NavigationButton variant="left" onPress={() => navigation.goBack()} />
          <Typography variant="h6" weight="bold">
            👤 Profile
          </Typography>
        </View>
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
            setRefreshProfile(prev => prev + 1); // Trigger profile reload
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
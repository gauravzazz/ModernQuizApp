import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { moderateScale, scale, verticalScale } from '../utils/scaling';
import { UserAward } from '../types/profile';

interface ProfileAwardsProps {
  awards: UserAward[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProfileAwards: React.FC<ProfileAwardsProps> = ({ awards }) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: verticalScale(24),
      paddingHorizontal: scale(4),
    },
    awardItem: {
      width: (SCREEN_WIDTH - scale(64)) / 3,
      aspectRatio: 1,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(20),
      padding: moderateScale(12),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(8),
      elevation: moderateScale(6),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
    },
    awardIcon: {
      fontSize: moderateScale(40),
      marginBottom: verticalScale(10),
      color: theme.colors.primary,
      textShadowColor: theme.colors.neuDark,
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(3),
    },
    awardName: {
      textAlign: 'center',
      fontSize: moderateScale(13),
      fontWeight: '600',
    },
    lockedAward: {
      opacity: 0.5,
    },
    lockIcon: {
      position: 'absolute',
      top: '40%',
      fontSize: moderateScale(28),
      color: theme.colors.onSurfaceVariant,
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
      textShadowRadius: moderateScale(2),
    },
  });

  return (
    <View style={styles.container}>
      {awards.map((award) => (
        <View 
          key={award.id} 
          style={[styles.awardItem, !award.unlocked && styles.lockedAward]}
        >
          <Typography style={styles.awardIcon}>{award.icon}</Typography>
          <Typography style={styles.awardName} numberOfLines={2}>
            {award.name}
          </Typography>
          {!award.unlocked && (
            <MaterialCommunityIcons name="lock" style={styles.lockIcon} />
          )}
        </View>
      ))}
    </View>
  );
};
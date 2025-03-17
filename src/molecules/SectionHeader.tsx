import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography } from '../atoms/Typography';
import { AppTheme } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { moderateScale, scaledSpacing } from '../utils/scaling';
import { MaterialCommunityIconName } from '../types/icons';

interface SectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  iconName: MaterialCommunityIconName;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isExpanded,
  onToggle,
  iconName,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 2,
      padding: scaledSpacing(16),
      marginBottom: scaledSpacing(16),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(3), height: moderateScale(3) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(6),
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: moderateScale(18),
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onToggle}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={iconName}
          size={moderateScale(24)}
          color={theme.colors.primary}
          style={{ marginRight: scaledSpacing(8) }}
        />
        <Typography style={styles.sectionTitle}>{title}</Typography>
      </View>
      <MaterialCommunityIcons
        name={(isExpanded ? 'chevron-up' : 'chevron-down') as MaterialCommunityIconName}
        size={moderateScale(24)}
        color={theme.colors.onSurface}
      />
    </TouchableOpacity>
  );
};
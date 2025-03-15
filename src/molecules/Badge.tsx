import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../atoms/Typography';
import { MaterialIcons } from '@expo/vector-icons';
import { moderateScale, scaledRadius, scaledSpacing } from '../utils/scaling';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';

interface BadgeProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  textColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  icon, 
  color, 
  textColor 
}) => {
  const theme = useTheme<AppTheme>();
  
  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: color || theme.colors.primary,
        paddingVertical: scaledSpacing(4),
        paddingHorizontal: scaledSpacing(8),
      }
    ]}>
      {icon && (
        <MaterialIcons
          name={icon}
          size={moderateScale(14)}
          color={textColor || theme.colors.onPrimary}
          style={styles.icon}
        />
      )}
      <Typography 
        variant="caption" 
        weight="medium" 
        style={{ color: textColor || theme.colors.onPrimary }}
      >
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaledRadius(20),
  },
  icon: {
    marginRight: scaledSpacing(4),
  },
});
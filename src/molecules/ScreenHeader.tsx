import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { NavigationButton } from '../atoms/NavigationButton';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
}) => {
  const theme = useTheme<AppTheme>();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      gap: 12,
    },
  });

  return (
    <View style={styles.container}>
      {showBackButton && (
        <NavigationButton
          variant="left"
          onPress={onBack || (() => {})}
        />
      )}
      <Typography variant="h4" weight="bold">
        {title}
      </Typography>
    </View>
  );
};
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { NavigationButton } from '../atoms/NavigationButton';
import { RootStackParamList } from '../navigation';

type QuizResultHeaderProps = {
  title?: string;
};

export const QuizResultHeader: React.FC<QuizResultHeaderProps> = ({ title = 'Quiz Results' }) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      gap: 12,
    },
    headerTitle: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <NavigationButton
        variant="left"
        onPress={() => navigation.navigate('Home')}
      />
      <Typography variant="h4" weight="bold" style={styles.headerTitle}>
        {title}
      </Typography>
    </View>
  );
};
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { RootStackParamList } from '../navigation';

type QuizResultHeaderProps = {
  title?: string;
};

export const QuizResultHeader: React.FC<QuizResultHeaderProps> = ({ title = 'Quiz Results' }) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingTop: 16,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.roundness,
      backgroundColor: theme.colors.neuPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Typography>←</Typography>
      </TouchableOpacity>
      <Typography variant="h5" weight="bold" style={styles.headerTitle}>
        {title}
      </Typography>
      <View style={{ width: 40 }} />
    </View>
  );
};
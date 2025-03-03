import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, TextInput, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: initialValue = '',
  onChangeText,
  onSubmit,
  style,
}) => {
  const theme = useTheme<AppTheme>();
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleChangeText = (text: string) => {
    setValue(text);
    onChangeText?.(text);
  };

  const handleSubmit = () => {
    onSubmit?.(value);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: theme.roundness * 1.5,
      borderWidth: 1.5,
      borderColor: isFocused ? theme.colors.primary : theme.colors.neuLight,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
    },
    input: {
      flex: 1,
      color: theme.colors.onSurface,
      fontSize: 16,
      padding: 0,
      marginLeft: 12,
      fontWeight: '500',
    },
    searchIcon: {
      fontSize: 18,
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        value={value}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
      />
    </View>
  );
};
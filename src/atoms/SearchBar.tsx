import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, TextInput, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';
import { moderateScale, scaledSpacing, scaledFontSize, scaledRadius } from '../utils/scaling';

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
      borderRadius: scaledRadius(theme.roundness * 1.5),
      borderWidth: moderateScale(1.5),
      borderColor: isFocused ? theme.colors.primary : theme.colors.neuLight,
      padding: scaledSpacing(16),
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
      shadowOpacity: 1,
      shadowRadius: moderateScale(10),
      elevation: moderateScale(8),
    },
    input: {
      flex: 1,
      color: theme.colors.onSurface,
      fontSize: scaledFontSize(16),
      padding: 0,
      marginLeft: scaledSpacing(12),
      fontWeight: '500',
    },
    searchIcon: {
      fontSize: scaledFontSize(18),
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
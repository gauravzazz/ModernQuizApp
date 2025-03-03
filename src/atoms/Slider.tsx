import React, { useState } from 'react';
import { StyleSheet, View, PanResponder, Animated, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTheme } from '../theme';
import { Typography } from './Typography';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  style?: ViewStyle;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value: initialValue,
  onValueChange,
  style,
  showValue = true,
}) => {
  const theme = useTheme<AppTheme>();
  const [value, setValue] = useState(initialValue ?? min);
  const [animatedValue] = useState(new Animated.Value(0));

  const getPositionFromValue = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (position: number) => {
    const rawValue = (position / 100) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gestureState) => {
      const trackWidth = 300; // Fixed width of the track
      const position = (gestureState.moveX / trackWidth) * 100;
      const newValue = getValueFromPosition(position);
      
      if (newValue !== value) {
        setValue(newValue);
        onValueChange?.(newValue);
        animatedValue.setValue(getPositionFromValue(newValue));
      }
    },
    onPanResponderRelease: () => {},
  });

  const styles = StyleSheet.create({
    container: {
      width: 300,
      padding: 16,
    },
    track: {
      height: 8,
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: 4,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    fill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    thumb: {
      position: 'absolute',
      top: -10,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.neuPrimary,
      elevation: 8,
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.neuLight,
    },
    valueText: {
      marginTop: 8,
      textAlign: 'center',
    },
  });

  const position = getPositionFromValue(value);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${position}%` }]} />
        <Animated.View
          style={[styles.thumb, { left: `${position}%` }]}
          {...panResponder.panHandlers}
        />
      </View>
      {showValue && (
        <Typography variant="caption" style={styles.valueText}>
          {value}
        </Typography>
      )}
    </View>
  );
};
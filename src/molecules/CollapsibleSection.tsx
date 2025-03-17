import React from 'react';
import { Animated, View } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { MaterialCommunityIconName } from '../types/icons';

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  iconName: MaterialCommunityIconName;
  animatedHeight: Animated.Value;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  iconName,
  animatedHeight,
  children,
}) => {
  return (
    <View>
      <SectionHeader
        title={title}
        isExpanded={isExpanded}
        onToggle={onToggle}
        iconName={iconName}
      />
      
      <Animated.View
        style={{
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000]
          }),
          overflow: 'hidden',
          opacity: animatedHeight
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};
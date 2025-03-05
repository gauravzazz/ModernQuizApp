import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = (size: number) => width / guidelineBaseWidth * size;
export const verticalScale = (size: number) => height / guidelineBaseHeight * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Font scaling
export const scaledFontSize = (size: number) => moderateScale(size);

// Spacing scaling
export const scaledSpacing = (size: number) => moderateScale(size);

// Border radius scaling
export const scaledRadius = (size: number) => moderateScale(size);

// Icon scaling
export const scaledIconSize = (size: number) => moderateScale(size);

// Shadow scaling
export const scaledShadow = (size: number) => ({
  shadowOffset: {
    width: moderateScale(size / 3),
    height: moderateScale(size / 3),
  },
  shadowRadius: moderateScale(size),
  elevation: moderateScale(size),
});
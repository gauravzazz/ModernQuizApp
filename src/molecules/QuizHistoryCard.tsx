import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { ProcessedQuizResult } from '../services/quizResultService';
import { moderateScale, scaledSpacing, scaledRadius, scaledFontSize } from '../utils/scaling';

interface QuizHistoryCardProps {
  quizResult: ProcessedQuizResult;
  onPress: (quizResult: ProcessedQuizResult) => void;
}

export const QuizHistoryCard: React.FC<QuizHistoryCardProps> = ({ quizResult, onPress }) => {
  const theme = useTheme<AppTheme>();
  const scoreAnimation = new Animated.Value(0);
  const scorePercentage = Math.round(quizResult.scorePercentage);
  const date = new Date(quizResult.timestamp).toLocaleDateString();
  
  // Determine performance level and colors
  const getPerformanceLevel = () => {
    if (scorePercentage >= 80) return { level: 'Excellent', color: theme.colors.success };
    if (scorePercentage >= 60) return { level: 'Good', color: theme.colors.info };
    if (scorePercentage >= 40) return { level: 'Average', color: theme.colors.warning };
    return { level: 'Needs Improvement', color: theme.colors.error };
  };

  const performance = getPerformanceLevel();
  
  // Animate score on mount
  useEffect(() => {
    Animated.timing(scoreAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate circle properties for the progress indicator
  const size = moderateScale(80);
  const strokeWidth = moderateScale(8);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  const styles = StyleSheet.create({
    card: {
      borderRadius: scaledRadius(theme.roundness * 2),
      marginBottom: scaledSpacing(16),
      overflow: 'hidden',
      shadowColor: theme.colors.neuDark,
      shadowOffset: {
        width: moderateScale(4),
        height: moderateScale(4),
      },
      shadowOpacity: theme.dark ? 0.6 : 0.3,
      shadowRadius: moderateScale(10),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
    },
    cardInner: {
      padding: scaledSpacing(16),
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaledSpacing(12),
    },
    quizTitle: {
      flex: 1,
      marginRight: scaledSpacing(8),
    },
    date: {
      opacity: 0.7,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    scoreContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      marginRight: scaledSpacing(16),
    },
    infoContainer: {
      flex: 1,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaledSpacing(8),
    },
    infoIcon: {
      marginRight: scaledSpacing(8),
    },
    infoText: {
      flex: 1,
    },
    performanceContainer: {
      marginTop: scaledSpacing(12),
      paddingTop: scaledSpacing(12),
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    performanceText: {
      marginLeft: scaledSpacing(8),
    },
    performanceLevel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    gradientBadge: {
      paddingHorizontal: scaledSpacing(12),
      paddingVertical: scaledSpacing(4),
      borderRadius: scaledRadius(theme.roundness),
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(quizResult)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[theme.colors.neuPrimary, theme.colors.neuLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardInner}
      >
        <View style={styles.cardHeader}>
          <Typography variant="h3" style={styles.quizTitle} numberOfLines={1}>
            {quizResult.quiz}
          </Typography>
          <Typography variant="body2" style={styles.date}>
            {date}
          </Typography>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.scoreContainer}>
            <Svg width={size} height={size}>
              {/* Background Circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={theme.colors.neuLight}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              
              {/* Progress Circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={performance.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
              />
              
              {/* Score Text */}
              <SvgText
                x={size / 2}
                y={size / 2 + scaledFontSize(6)}
                fontSize={scaledFontSize(20)}
                fontWeight="bold"
                fill={theme.colors.onSurface}
                textAnchor="middle"
              >
                {scorePercentage}%
              </SvgText>
            </Svg>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={moderateScale(18)}
                color={theme.colors.onSurfaceVariant}
                style={styles.infoIcon}
              />
              <Typography variant="body2" style={styles.infoText}>
                Time: {quizResult.timeTaken}
              </Typography>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="format-list-numbered"
                size={moderateScale(18)}
                color={theme.colors.onSurfaceVariant}
                style={styles.infoIcon}
              />
              <Typography variant="body2" style={styles.infoText}>
                Questions: {quizResult.totalQuestions}
              </Typography>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="gamepad-variant-outline"
                size={moderateScale(18)}
                color={theme.colors.onSurfaceVariant}
                style={styles.infoIcon}
              />
              <Typography variant="body2" style={styles.infoText}>
                Mode: {quizResult.mode}
              </Typography>
            </View>
          </View>
        </View>
        
        <View style={styles.performanceContainer}>
          <View style={styles.performanceLevel}>
            <MaterialCommunityIcons
              name={scorePercentage >= 60 ? "trophy-outline" : "school-outline"}
              size={moderateScale(20)}
              color={performance.color}
            />
            <Typography
              variant="body2"
              style={[styles.performanceText, { color: performance.color }]}
            >
              {performance.level}
            </Typography>
          </View>
          
          <LinearGradient
            colors={[theme.colors.neuLight, theme.colors.neuPrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBadge}
          >
            <Typography variant="body2">
              {quizResult.subject}
            </Typography>
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
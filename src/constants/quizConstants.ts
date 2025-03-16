import { AppTheme } from '../theme';

export const createPieChartData = (theme: AppTheme, correctAnswers: number, incorrectAnswers: number, skippedAnswers: number) => [
  {
    name: 'Correct',
    population: correctAnswers,
    color: theme.colors.success,
    legendFontColor: theme.colors.onSurface,
    legendFontSize: 12
  },
  {
    name: 'Incorrect',
    population: incorrectAnswers,
    color: theme.colors.error,
    legendFontColor: theme.colors.onSurface,
    legendFontSize: 12
  },
  {
    name: 'Skipped',
    population: skippedAnswers,
    color: theme.colors.warning,
    legendFontColor: theme.colors.onSurface,
    legendFontSize: 12
  }
];

export const createChartConfig = (theme: AppTheme) => ({
  backgroundGradientFrom: theme.colors.background,
  backgroundGradientTo: theme.colors.background,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => theme.colors.onSurface,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: theme.colors.primary
  }
});
export interface ColorTokens {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  success: string;
  error: string;
  warning: string;
  border: string;
  borderLight: string;
  shadow: string;
  overlay: string;
  chat: {
    userBubble: string;
    otherBubble: string;
    userText: string;
    otherText: string;
  };
}

export const lightTheme: ColorTokens = {
  primary: '#6D5DFB',
  primaryLight: '#B9E8FF',
  primaryDark: '#4D2CCF',
  secondary: '#22D3EE',
  background: '#F7F8FF',
  surface: 'rgba(255, 255, 255, 0.82)',
  surfaceElevated: 'rgba(255, 255, 255, 0.94)',
  textPrimary: '#182033',
  textSecondary: '#59627A',
  textTertiary: '#8992A8',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  border: 'rgba(255, 255, 255, 0.5)',
  borderLight: 'rgba(255, 255, 255, 0.28)',
  shadow: 'rgba(47, 35, 117, 0.18)',
  overlay: 'rgba(24, 32, 51, 0.42)',
  chat: {
    userBubble: '#6D5DFB',
    otherBubble: 'rgba(255, 255, 255, 0.82)',
    userText: '#FFFFFF',
    otherText: '#182033',
  },
};

export const darkTheme: ColorTokens = {
  primary: '#9EA7FF',
  primaryLight: '#2534A5',
  primaryDark: '#7C3AED',
  secondary: '#22D3EE',
  background: '#111827',
  surface: 'rgba(31, 41, 55, 0.82)',
  surfaceElevated: 'rgba(55, 65, 81, 0.94)',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  border: 'rgba(255, 255, 255, 0.18)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  chat: {
    userBubble: '#7C3AED',
    otherBubble: 'rgba(31, 41, 55, 0.82)',
    userText: '#FFFFFF',
    otherText: '#F9FAFB',
  },
};

export const Colors = lightTheme;

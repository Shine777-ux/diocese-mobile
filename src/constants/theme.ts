import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#f8fafc',
    background: '#181f2a',
    backgroundElement: '#1e2533',
    backgroundSelected: '#252f40',
    textSecondary: '#94a3b8',
  },
  dark: {
    text: '#f8fafc',
    background: '#181f2a',
    backgroundElement: '#1e2533',
    backgroundSelected: '#252f40',
    textSecondary: '#94a3b8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

// 1st Colour Combination:
// Canvas: #181f2a (Deep Slate-Navy)
// Surfaces / Cards: #1e2533 (Rich Surface)
// Accents: #38bdf8 (Cyan Highlight) / #3b82f6 (Slate Blue)
// Borders: rgba(255, 255, 255, 0.08)
export const COLORS = {
  primary: '#38bdf8', // Cyan highlight from 1st combination
  primaryLight: '#7dd3fc',
  primaryDark: '#0284c7',
  
  secondary: '#3b82f6', // Slate blue
  accent: '#38bdf8', // Cyan accent
  
  background: '#181f2a', // 1st combination deep navy-slate canvas
  surface: '#1e2533',    // 1st combination rich surface / cards / paper
  surfaceLight: 'rgba(30, 37, 51, 0.85)',
  
  text: '#f8fafc',       // Bright crisp text for dark
  textLight: '#94a3b8',  // Muted secondary text
  textWhite: '#ffffff',
  
  border: 'rgba(255, 255, 255, 0.08)',
  error: '#f87171',
  success: '#34d399',
};

export const GRADIENTS = {
  primary: ['#1e2533', '#181f2a'],
  secondary: ['#38bdf8', '#0284c7'],
  background: ['#181f2a', '#181f2a'],
  card1: ['#1e2533', '#181f2a'],
  card2: ['#1e2533', '#181f2a'],
  card3: ['#1e2533', '#181f2a'],
  card4: ['#1e2533', '#181f2a'],
};

export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  }
};

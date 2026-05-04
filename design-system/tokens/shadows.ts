import { ViewStyle, Platform } from 'react-native';

// ======================================
// TIPOS
// ======================================
export interface ShadowStyle extends ViewStyle {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;

  // 👇 WEB SUPPORT
  boxShadow?: string;
}

// ======================================
// FUNÇÃO BASE (🔥 MELHOR PRÁTICA)
// ======================================
function createClayShadow(depth = 6): ShadowStyle {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: depth, height: depth },
      shadowOpacity: 0.12,
      shadowRadius: depth * 2,
    },
    android: {
      elevation: depth,
    },
    web: {
      boxShadow: `
        ${depth}px ${depth}px ${depth * 2}px rgba(0,0,0,0.12),
        -${depth}px -${depth}px ${depth * 2}px rgba(255,255,255,0.7)
      `,
    },
  }) as ShadowStyle;
}

// ======================================
// ✅ HELPER SEGURO PARA SHADOWS
// ======================================

/**
 * Retorna shadow seguro para o platform atual
 * - Em mobile: retorna shadow properties
 * - Em web: retorna boxShadow CSS-compatible
 * 
 * Uso:
 * style={[styles.button, getShadow(clayMedium)]}
 */
export function getShadow(shadow: ShadowStyle | any): ShadowStyle {
  if (Platform.OS === 'web') {
    // Web: retorna apenas boxShadow, remove propriedades inválidas
    return {
      boxShadow: (shadow as any).boxShadow || 'none',
    } as ShadowStyle;
  }

  // Mobile: retorna shadow properties, remove boxShadow
  const { boxShadow, ...mobileStyle } = shadow as any;
  return mobileStyle as ShadowStyle;
}

// ======================================
// VARIAÇÕES
// ======================================

export const claySoft = createClayShadow(3);
export const clayMedium = createClayShadow(6);
export const clayStrong = createClayShadow(10);

// ======================================
// LIGHT / DARK (OPCIONAL)
// ======================================

export const clayLight: ShadowStyle = Platform.select({
  ios: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  android: {
    elevation: 2,
  },
  web: {
    boxShadow: '-3px -3px 8px rgba(255,255,255,0.8)',
  },
}) as ShadowStyle;

export const clayDark: ShadowStyle = Platform.select({
  ios: {
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  android: {
    elevation: 8,
  },
  web: {
    boxShadow: '4px 6px 12px rgba(0,0,0,0.2)',
  },
}) as ShadowStyle;

// ======================================
// COMBINADO
// ======================================

export const clayCombined = createClayShadow(8);

// ======================================
// MAPA
// ======================================

export const ClayMorphismShadows = {
  none: {},

  sm: claySoft,
  md: clayMedium,
  lg: clayStrong,

  clay: {
    soft: claySoft,
    medium: clayMedium,
    strong: clayStrong,
    combined: clayCombined,
    light: clayLight,
    dark: clayDark,
  },
} as const;
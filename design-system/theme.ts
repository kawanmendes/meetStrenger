/**
 * 🎨 THEME CENTRAL DO DESIGN SYSTEM
 *
 * Este arquivo é o ponto único de verdade para todo o visual do app.
 * Consolida: cores, espaçamento, tipografia, sombras e tokens de claymorphism.
 *
 * Uso:
 * import { theme } from './design-system/theme'
 * const { colors, spacing, typography } = theme;
 */

import { ColorTokens, lightTheme, darkTheme } from './tokens/colors';
import { FontSizes, FontWeights, LineHeights, TextStyles } from './tokens/typography';
import { Spacing, BorderRadius, Layout, Opacity } from './tokens/spacing';
import { AppShadows } from './tokens/shadows';
import { Gradients } from './tokens/gradients';

// ======================================
// TOKENS DE CLAYMORPHISM (SOFT UI)
// ======================================
export const clayTokens = {
  // Sombras externas suaves (embaixo-direita)
  shadowLight: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 0,
  },
  
  // Sombra escura (bottom-right)
  shadowDark: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },

  // Combina as duas para efeito clay (camadas)
  combined: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Valores para utilizar em componentes
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};

// ======================================
// TEMA CONSOLIDADO (Light)
// ======================================
export const theme = {
  // Paleta de cores
  colors: lightTheme,

  // Espaçamento
  spacing: Spacing,

  // Tipografia
  typography: {
    fontSizes: FontSizes,
    fontWeights: FontWeights,
    lineHeights: LineHeights,
    textStyles: TextStyles,
  },

  // Sombras (padrão + claymorphism)
  shadows: AppShadows,
  gradients: Gradients,

  // Bordas/raios
  radius: BorderRadius,

  // Layout (dimensões padrão)
  layout: Layout,

  // Opacidades
  opacity: Opacity,

  // Tokens de claymorphism
  clay: clayTokens,
} as const;

// ======================================
// TEMA DARK (quando implementado)
// ======================================
export const themeDark = {
  colors: darkTheme,
  spacing: Spacing,
  typography: {
    fontSizes: FontSizes,
    fontWeights: FontWeights,
    lineHeights: LineHeights,
    textStyles: TextStyles,
  },
  shadows: AppShadows,
  gradients: Gradients,
  radius: BorderRadius,
  layout: Layout,
  opacity: Opacity,
  clay: clayTokens,
} as const;

// ======================================
// TIPO DO TEMA (para TypeScript)
// ======================================
export type Theme = typeof theme;

/**
 * Hook global do tema
 * Use: const { colors, spacing } = useTheme();
 */
export type ThemeContextType = Theme | null;

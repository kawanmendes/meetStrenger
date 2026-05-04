/**
 * 🎨 HOOK useTheme
 *
 * Acessa o tema global em qualquer componente
 *
 * Uso:
 * const { colors, spacing, clay } = useTheme();
 */

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * useTheme Hook
 * 
 * Retorna o tema completo do app
 * 
 * @throws Error se usado fora de ThemeProvider
 * 
 * @returns {Object} Tema com colors, spacing, typography, shadows, etc.
 * 
 * @example
 * ```typescript
 * const { colors, spacing, clay } = useTheme();
 * 
 * // Usar em estilos
 * backgroundColor: colors.primary
 * paddingHorizontal: spacing.lg
 * ...clay.medium  // shadow clay
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      '❌ useTheme deve ser usado dentro de <ThemeProvider>. ' +
      'Envolver sua aplicação com ThemeProvider em _layout.tsx'
    );
  }

  return context.theme;
}

/**
 * useThemeMode Hook (auxiliar)
 * 
 * Retorna modo atual e funções para trocar tema
 * 
 * @example
 * ```typescript
 * const { mode, toggleTheme } = useThemeMode();
 * <Button onPress={toggleTheme}>
 *   {mode === 'light' ? '🌙' : '☀️'}
 * </Button>
 * ```
 */
export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      '❌ useThemeMode deve ser usado dentro de <ThemeProvider>'
    );
  }

  return {
    mode: context.mode,
    toggleTheme: context.toggleTheme,
    setTheme: context.setTheme,
  };
}

/**
 * Hook alternativo que retorna ambos
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      '❌ useThemeContext deve ser usado dentro de <ThemeProvider>'
    );
  }

  return context;
}

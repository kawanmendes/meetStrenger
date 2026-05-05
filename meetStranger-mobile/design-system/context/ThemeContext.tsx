/**
 * 🎨 THEME CONTEXT - GERENCIADOR GLOBAL DO TEMA
 *
 * Permite:
 * - Acessar tema em qualquer componente
 * - Trocar tema em runtime (light/dark)
 * - Escalabilidade futura
 *
 * Uso:
 * 1. Envolver app em <ThemeProvider>
 * 2. Acessar em componentes com useTheme()
 */

import React, { createContext, useState, useMemo } from 'react';
import { theme, themeDark, Theme, ThemeContextType } from '../theme';

// ======================================
// TIPO DO CONTEXTO
// ======================================
export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

// ======================================
// CRIAR CONTEXTO
// ======================================
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

// ======================================
// PROVIDER COMPONENT
// ======================================
interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

/**
 * ThemeProvider
 * Envolver a aplicação com este componente
 * 
 * Exemplo:
 * <ThemeProvider initialMode="light">
 *   <Stack />
 * </ThemeProvider>
 */
export function ThemeProvider({
  children,
  initialMode = 'light',
}: ThemeProviderProps) {
  
  // Estado do tema
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  // Selecionar tema baseado no modo
  const currentTheme = useMemo(
    () => (mode === 'light' ? theme : themeDark),
    [mode]
  );

  // Função para alternar tema
  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Valor do contexto
  const value: ThemeContextValue = {
    theme: currentTheme,
    mode,
    toggleTheme,
    setTheme: setMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ======================================
// EXPORT
// ======================================
export default ThemeProvider;

// =========================
// TOKENS (fundação do design system)
// =========================

// Exporta todas as cores (tema, paleta, chat, etc.)
export * from './tokens/colors';

// Exporta tipografia (fontSize, lineHeight, TextStyles)
export * from './tokens/typography';

// Exporta espaçamentos, bordas, layout, sombras
export * from './tokens/spacing';

// Exporta sombras de claymorphism
export * from './tokens/shadows';
export * from './tokens/gradients';

// =========================
// TEMA E CONTEXTO
// =========================

// Exporta o tema centralizado
export { theme, themeDark, clayTokens } from './theme';
export type { Theme } from './theme';

// Exporta o ThemeProvider
export { ThemeProvider, ThemeContext } from './context/ThemeContext';
export type { ThemeMode } from './context/ThemeContext';

// Exporta hooks do tema
export { useTheme, useThemeMode, useThemeContext } from './hooks/useTheme';

// =========================
// COMPONENTS (UI reutilizável)
// =========================

// Exporta o componente Button
export { Button } from './components/Button';

// Exporta o tipo das variantes do botão
export type { ButtonVariant, ButtonSize } from './components/Button';

// Exporta o componente Input
export { Input } from './components/Input';

// Exporta o tipo das variantes do input
export type { InputVariant } from './components/Input';

// Exporta o componente Card
export { Card } from './components/Card';

// Exporta o tipo das variantes do Card (default, elevated, outlined)
export type { CardVariant } from './components/Card';

// Exporta o componente de chat (bolha de mensagem)
export { ChatBubble } from './components/ChatBubble';

// Exporta o tipo de posição da bolha (left | right)
export type { ChatBubblePosition } from './components/ChatBubble';

export { GradientBackground } from './components/GradientBackground';
export { PillButton } from './components/PillButton';
export { PillInput } from './components/PillInput';
export { AnimalAvatar } from './components/AnimalAvatar';
export { ChatHeader } from './components/ChatHeader';


// =========================
// ANIMAÇÕES (interações e feedback)
// =========================

// Exporta animações de fade (entrada/saída)
export * from './animations/fade';

// Exporta animações de slide (movimento)
export * from './animations/slide';

// Exporta animações de interação (press, pulse, spin)
export * from './animations/interactions';


// =========================
// INFORMAÇÕES DO DESIGN SYSTEM
// =========================

// Objeto com metadados do design system
export const DesignSystemInfo = {
  name: 'MeetStranger Design System', // Nome do sistema
  version: '1.0.0', // Versão atual (controle de evolução)
  description: 'Design system focado em comunicação anônima, simplicidade e privacidade', // Propósito

  // Princípios de design que guiam as decisões visuais e UX
  principles: [
    'Minimalista',                         // Interface limpa
    'Alto contraste',                      // Boa legibilidade
    'Foco em leitura e conversação',       // UX voltada para chat
    'Feedback visual sutil',               // Interações suaves
    'Animações leves',                     // Performance + fluidez
    'Interface confortável para longas conversas', // Usabilidade prolongada
  ],
} as const; // Torna o objeto imutável e tipado

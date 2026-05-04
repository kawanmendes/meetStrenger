/**
 * 🎨 GUIDE: Novo Design System com Claymorphism
 *
 * Este arquivo demonstra como usar o novo design system
 * com suporte a tema global e claymorphism (Soft UI).
 *
 * ============================================
 * ✅ O QUE FOI IMPLEMENTADO
 * ============================================
 *
 * 1. ✅ CONSOLIDAÇÃO DE CORES
 *    - Removida duplicação (constants/colors.ts descontinuado)
 *    - Única fonte: design-system/tokens/colors.ts
 *    - Suporte a light + dark theme
 *
 * 2. ✅ THEME CENTRALIZADO (theme.ts)
 *    - Consolidação de: colors, spacing, typography, shadows
 *    - Fácil acesso via useTheme()
 *
 * 3. ✅ CLAYMORPHISM (Soft UI)
 *    - Sombras suaves e profundidade
 *    - design-system/tokens/shadows.ts com variações
 *    - Sem uso de CSS (React Native puro)
 *
 * 4. ✅ THEME CONTEXT (Provider Global)
 *    - ThemeProvider em _layout.tsx
 *    - Permite trocar tema em runtime
 *    - Escalável para dark mode
 *
 * 5. ✅ HOOKS (useTheme, useThemeMode)
 *    - Fácil acesso ao tema em qualquer componente
 *    - Type-safe com TypeScript
 *
 * 6. ✅ COMPONENTES EVOLUÍDOS (SEM DUPLICAÇÃO)
 *    - Button com variant="clay"
 *    - Card com variant="clay"
 *    - Input com variant="clay"
 *
 * ============================================
 * 📖 EXEMPLOS DE USO
 * ============================================
 */

// ============================================
// EXEMPLO 1: Usar Tema em um Componente
// ============================================

import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../design-system/hooks/useTheme';
import { Button, Card, Input } from '../design-system';

export function ExampleComponent() {
  // Acessar o tema (colors, spacing, shadows, etc.)
  const { colors, spacing, clay } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
    },
    card: {
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: 12,
      ...clay.shadowDark, // Sombra clay
    },
  });

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.textPrimary }}>Usando o tema!</Text>
    </View>
  );
}

// ============================================
// EXEMPLO 2: Botão com Claymorphism
// ============================================

export function ButtonExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      {/* Botão padrão */}
      <Button
        title="Padrão"
        variant="primary"
        onPress={() => console.log('Clicado!')}
      />

      {/* Botão Clay (NOVO!) */}
      <Button
        title="Clay UI"
        variant="clay"
        onPress={() => console.log('Claymorphism!')}
      />

      {/* Botão secundário */}
      <Button
        title="Secundário"
        variant="secondary"
        onPress={() => {}}
      />
    </View>
  );
}

// ============================================
// EXEMPLO 3: Card com Claymorphism
// ============================================

export function CardExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      {/* Card padrão */}
      <Card padding="lg">
        <Text>Card Padrão</Text>
      </Card>

      {/* Card Clay (NOVO!) */}
      <Card variant="clay" padding="lg">
        <Text>Card com Clay UI</Text>
      </Card>

      {/* Card elevado */}
      <Card variant="elevated" padding="lg">
        <Text>Card Elevado</Text>
      </Card>
    </View>
  );
}

// ============================================
// EXEMPLO 4: Input com Claymorphism
// ============================================

export function InputExamples() {
  return (
    <View style={{ gap: 12, padding: 16 }}>
      {/* Input padrão */}
      <Input
        label="Email"
        placeholder="seu@email.com"
        variant="default"
      />

      {/* Input Clay (NOVO!) */}
      <Input
        label="Senha"
        placeholder="••••••••"
        variant="clay"
        secureTextEntry
      />
    </View>
  );
}

// ============================================
// EXEMPLO 5: Trocar Tema (Light/Dark)
// ============================================

import { useThemeMode } from '../design-system/hooks/useTheme';

export function ThemeSwitcher() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Button
      title={mode === 'light' ? '🌙 Dark' : '☀️ Light'}
      variant="secondary"
      onPress={toggleTheme}
    />
  );
}

// ============================================
// EXEMPLO 6: Usar Tokens Diretamente
// ============================================

import { theme } from '../design-system/theme';

export function DirectTokenUsage() {
  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.typography.textStyles.h1,
      color: theme.colors.primary,
    },
    clayCard: {
      ...theme.clay.shadowDark,
      borderRadius: theme.clay.borderRadius.lg,
    },
  });

  return null; // Apenas exemplo de tipos
}

// ============================================
// ✅ CHECKLIST DE IMPLEMENTAÇÃO
// ============================================

/**
 * ✅ Consolidação de cores
 *    - Design system como única fonte
 *    - Sem mais imports de constants/colors
 *
 * ✅ Theme.ts centralizado
 *    - Tudo em um lugar
 *    - Fácil de manter
 *
 * ✅ Claymorphism implementado
 *    - Sombras soft
 *    - Profundidade visual
 *    - Componentes com variant="clay"
 *
 * ✅ Theme Context
 *    - Provider global
 *    - Suporta trocar tema
 *
 * ✅ Hooks useTheme
 *    - Type-safe
 *    - Fácil de usar
 *
 * ✅ Componentes escaláveis
 *    - Sem duplicação
 *    - Versáteis
 *
 * ============================================
 * 🚀 PRÓXIMOS PASSOS
 * ============================================
 *
 * 1. Atualizar telas para usar novo design system
 * 2. Implementar dark mode (já pronto no contexto)
 * 3. Adicionar mais variantes de componentes
 * 4. Criar componentes adicionais (Toast, Modal, etc.)
 * 5. Documentar padrões de uso
 *
 * ============================================\n */

// Não exportar nada - apenas documentação/exemplos
export {};

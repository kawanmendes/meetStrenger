// Importa utilitário de estilos
import { StyleSheet } from 'react-native';
 
// Importa cores do sistema
import { Colors as colors } from '../../design-system/tokens/colors';
 
// Importa tokens de espaçamento, borda e sombras
import { BorderRadius, Shadows, Spacing } from '../../design-system/tokens/spacing';
 
// Importa tipografia padronizada
import { TextStyles } from '../../design-system/tokens/typography';
 
// Cria e exporta os estilos da tela de Login
export const loginStyles = StyleSheet.create({
 
  // Container principal
  container: {
    flex: 1, // Ocupa toda a tela
    backgroundColor: colors.background, // Cor de fundo padrão
  },
 
  // Área central de conteúdo
  content: {
    flex: 1, // Ocupa o espaço disponível
    paddingHorizontal: Spacing.xl, //padding lateral
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
 
  // Logo do app
  logo: {
    width: 240,  // Tamanho fixo da imagem (mantido)
    height: 240, // Mantém proporção quadrada
    marginBottom: Spacing.xl, //espaço abaixo
    ...Shadows.lg, // shadow manual → padronizado
    shadowColor: colors.shadow, // Garante cor correta da sombra
  },
 
  // Container dos inputs
  inputContainer: {
    width: '100%', // Ocupa toda a largura disponível
  },
 
  // Título principal
  title: {
    ...TextStyles.title, // Tipografia base
    fontWeight: 'bold', // Destaque
    color: colors.primary, // Cor principal
    marginBottom: Spacing.sm, //  espaço abaixo
    letterSpacing: -0.2, // Ajuste fino
    lineHeight: 26, // Mantido para não quebrar layout
    textAlign: 'center', // Centraliza texto
  },
 
  // Subtítulo
  subtitle: {
    ...TextStyles.body, // Texto padrão
    color: colors.textSecondary, // Cor secundária
    marginBottom: Spacing['4xl'], // espaçamento maior
    lineHeight: 22, // Ajuste de leitura
    textAlign: 'center', // Centraliza
  },
 
  // Botão de login
  loginButton: {
    marginBottom: Spacing.sm, //  espaço abaixo
    marginTop: Spacing.xl, //  espaço acima
    borderRadius: BorderRadius.lg, //  padronizado
  },
});
 
 
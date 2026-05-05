import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, GradientBackground, PillButton, useTheme } from '../../design-system';

const sections = [
  {
    title: 'O que e o MeetStranger?',
    text: 'Uma experiencia de chat por interesses para encontrar novas pessoas de forma rapida, leve e segura.',
  },
  {
    title: 'Privacidade',
    text: 'A estrutura esta pronta para autenticacao por token, guard de rota e conexao WebSocket autenticada.',
  },
  {
    title: 'Como funciona',
    text: 'Escolha uma categoria, encontre um match e converse em uma sala preparada para mensagens em tempo real.',
  },
];

export default function About() {
  const router = useRouter();
  const theme = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing.lg,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '900',
      marginBottom: theme.spacing.xl,
    },
    content: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing['3xl'],
    },
    cardTitle: {
      color: theme.colors.textPrimary,
      fontSize: 18,
      fontWeight: '900',
      marginBottom: theme.spacing.sm,
    },
    cardText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '700',
    },
    footer: {
      gap: theme.spacing.md,
    },
  }), [theme]);

  return (
    <GradientBackground variant="soft">
      <View style={styles.container}>
        <Text style={styles.title}>Sobre</Text>
        <ScrollView contentContainerStyle={styles.content}>
          {sections.map((section) => (
            <Card key={section.title} variant="clay">
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardText}>{section.text}</Text>
            </Card>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <PillButton title="Voltar" variant="primary" onPress={() => router.back()} />
        </View>
      </View>
    </GradientBackground>
  );
}

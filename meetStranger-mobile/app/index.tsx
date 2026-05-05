import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimalAvatar, GradientBackground, PillButton, useTheme } from '../design-system';
import { appImages } from '../constants/assets';
import { mockUser } from '../constants/mock';
import { useAuth } from '../hooks/useAuth';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { login } = useAuth();
  const styles = useMemo(() => StyleSheet.create({
    safe: {
      flex: 1,
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['3xl'],
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brand: {
      alignItems: 'center',
      paddingTop: theme.spacing['3xl'],
      gap: theme.spacing.lg,
    },
    logo: {
      width: 128,
      height: 128,
      borderRadius: theme.radius.full,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 34,
      lineHeight: 40,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: 'rgba(255,255,255,0.86)',
      fontSize: 16,
      lineHeight: 23,
      fontWeight: '700',
      textAlign: 'center',
      maxWidth: 320,
    },
    actions: {
      width: '100%',
      gap: theme.spacing.md,
    },
  }), [theme]);

  const enterWithMockUser = async () => {
    await login(mockUser.email, 'mock123');
    router.replace('/home');
  };

  return (
    <GradientBackground variant="bubbles">
      <View style={styles.safe}>
        <View style={styles.brand}>
          <AnimalAvatar size={150} source={appImages.mascot} />
          <Text style={styles.title}>MeetStranger</Text>
          <Text style={styles.subtitle}>Entre em salas por interesses e converse com alguem novo em segundos.</Text>
        </View>

        <View style={styles.actions}>
          <PillButton title="Entrar como teste" variant="primary" onPress={enterWithMockUser} />
          <PillButton title="Entrar" variant="primary" onPress={() => router.push('/auth/login')} />
          <PillButton title="Criar conta" onPress={() => router.push('/auth/register')} />
        </View>
      </View>
    </GradientBackground>
  );
}

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimalAvatar, GradientBackground, PillButton, useTheme, useThemeMode } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { appImages } from '../../constants/assets';

export default function Profile() {
  const router = useRouter();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
      alignItems: 'center',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '900',
      marginTop: theme.spacing.lg,
      textAlign: 'center',
    },
    email: {
      color: 'rgba(255,255,255,0.82)',
      fontSize: 14,
      fontWeight: '700',
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    panel: {
      width: '100%',
      marginTop: theme.spacing['3xl'],
      gap: theme.spacing.md,
    },
  }), [theme]);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <AnimalAvatar source={appImages.mascot} size={142} />
        <Text style={styles.title}>{user?.username || 'Stranger'}</Text>
        <Text style={styles.email}>{user?.email || 'Conta local'}</Text>
        <View style={styles.panel}>
          <PillButton title="Loja de avatares" variant="primary" onPress={() => router.push('/profile/avatar-shop')} />
          <PillButton title={`Tema: ${mode === 'light' ? 'claro' : 'escuro'}`} onPress={toggleTheme} />
          <PillButton title="Voltar para home" onPress={() => router.replace('/home')} />
          <PillButton title="Sair" variant="ghost" onPress={logout} />
        </View>
      </View>
    </GradientBackground>
  );
}

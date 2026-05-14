/**
 * 👤 PERFIL — MeetStranger Mobile
 *
 * Atualizado para exibir o avatar equipado dinamicamente
 * a partir do AvatarShopContext (useAvatarShop).
 *
 * Caminho: app/profile/index.tsx
 */

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AnimalAvatar,
  GradientBackground,
  PillButton,
  useTheme,
  useThemeMode,
} from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { useAvatarShop } from '../../hooks/useAvatarShop';

export default function Profile() {
  const router = useRouter();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();

  // ✅ Avatar equipado vindo do contexto global da loja
  const { equippedAvatar, coins } = useAvatarShop();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: theme.spacing['2xl'],
          paddingTop: theme.spacing['4xl'],
          paddingBottom: theme.spacing['2xl'],
          alignItems: 'center',
        },
        avatarWrap: {
          position: 'relative',
          alignItems: 'center',
        },
        coinBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(255,255,255,0.82)',
          paddingHorizontal: theme.spacing.md,
          paddingVertical: 5,
          borderRadius: theme.radius.full,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.6)',
          marginTop: theme.spacing.sm,
        },
        coinIcon: { fontSize: 14 },
        coinText: {
          fontSize: 13,
          fontWeight: '900',
          color: theme.colors.primaryDark,
        },
        avatarNameBadge: {
          marginTop: 6,
          backgroundColor: 'rgba(109,93,251,0.12)',
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: theme.radius.full,
          borderWidth: 1,
          borderColor: 'rgba(109,93,251,0.22)',
        },
        avatarNameText: {
          fontSize: 12,
          fontWeight: '800',
          color: theme.colors.primaryDark,
          letterSpacing: 0.3,
        },
        title: {
          color: theme.colors.textPrimary,
          fontSize: 30,
          lineHeight: 36,
          fontWeight: '900',
          marginTop: theme.spacing.lg,
          textAlign: 'center',
        },
        email: {
          color: theme.colors.textSecondary,
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
      }),
    [theme]
  );

  return (
    <GradientBackground>
      <View style={styles.container}>

        {/* ✅ Avatar equipado dinamicamente + saldo de moedas */}
        <View style={styles.avatarWrap}>
          <AnimalAvatar source={equippedAvatar.image} size={142} />

          {/* Badge com nome do avatar ativo */}
          <View style={styles.avatarNameBadge}>
            <Text style={styles.avatarNameText}>✦ {equippedAvatar.name}</Text>
          </View>

          {/* Saldo de moedas abaixo do avatar */}
          <View style={styles.coinBadge}>
            <Text style={styles.coinIcon}>🪙</Text>
            <Text style={styles.coinText}>{coins} moedas</Text>
          </View>
        </View>

        <Text style={styles.title}>{user?.username || 'Stranger'}</Text>
        <Text style={styles.email}>{user?.email || 'Conta local'}</Text>

        <View style={styles.panel}>
          <PillButton
            title="Loja de avatares"
            variant="primary"
            onPress={() => router.push('/profile/avatar-shop')}
          />

          <PillButton
            title="Voltar para home"
            onPress={() => router.replace('/home')}
          />
          <PillButton title="Sair" variant="ghost" onPress={logout} />
        </View>

      </View>
    </GradientBackground>
  );
}
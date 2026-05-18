import React, { useMemo } from 'react';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  AnimalAvatar,
  GradientBackground,
  PillButton,
  useTheme,
} from '../../design-system';

import { useAvatarShop } from '../../hooks/useAvatarShop';
import { useAuth } from '../../hooks/useAuth';

const COIN_PACKS = [
  {
    id: '1',
    coins: '500 moedas',
    price: 'R$ 4,99',
    bonus: '+50 bônus',
  },

  {
    id: '2',
    coins: '1.200 moedas',
    price: 'R$ 9,99',
    bonus: '+200 bônus',
  },

  {
    id: '3',
    coins: '2.500 moedas',
    price: 'R$ 19,99',
    bonus: '+500 bônus',
  },

  {
    id: '4',
    coins: '5.000 moedas',
    price: 'R$ 34,99',
    bonus: '+1.500 bônus',
  },
];

export default function CoinShop() {
  const router = useRouter();

  const theme = useTheme();

  const { user } = useAuth();

  const { equippedAvatar } = useAvatarShop();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: theme.spacing['4xl'],
          paddingHorizontal: theme.spacing.lg,
        },

        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing['2xl'],
        },

        greeting: {
          flex: 1,
        },

        hello: {
          color: theme.colors.textSecondary,
          fontSize: 13,
          fontWeight: '800',
        },

        name: {
          color: theme.colors.textPrimary,
          fontSize: 22,
          lineHeight: 27,
          fontWeight: '900',
        },

        profile: {
          width: 48,
          height: 48,
          borderRadius: theme.radius.full,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        },

        title: {
          color: theme.colors.textPrimary,
          fontSize: 32,
          lineHeight: 38,
          fontWeight: '900',
          marginBottom: theme.spacing.sm,
        },

        subtitle: {
          color: theme.colors.textSecondary,
          fontSize: 15,
          fontWeight: '700',
          lineHeight: 22,
          marginBottom: theme.spacing.xl,
        },

        balanceCard: {
          backgroundColor: 'rgba(255,255,255,0.82)',
          borderRadius: theme.radius['2xl'],
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.xl,
          alignItems: 'center',
        },

        balanceLabel: {
          color: theme.colors.textSecondary,
          fontSize: 14,
          fontWeight: '800',
          marginBottom: theme.spacing.sm,
        },

        balanceValue: {
          color: '#5B34F2',
          fontSize: 34,
          fontWeight: '900',
        },

        list: {
          paddingBottom: theme.spacing['4xl'],
          gap: theme.spacing.md,
        },

        card: {
          backgroundColor: 'rgba(255,255,255,0.84)',
          borderRadius: theme.radius['2xl'],
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },

        cardLeft: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          flex: 1,
        },

        coinIcon: {
          width: 62,
          height: 62,
          borderRadius: 20,
          backgroundColor: 'rgba(104, 80, 255, 0.12)',
          alignItems: 'center',
          justifyContent: 'center',
        },

        coinEmoji: {
          fontSize: 30,
        },

        cardInfo: {
          flex: 1,
        },

        coinAmount: {
          color: theme.colors.textPrimary,
          fontSize: 22,
          fontWeight: '900',
          marginBottom: 4,
        },

        bonus: {
          color: '#5B34F2',
          fontSize: 13,
          fontWeight: '800',
        },

        priceButton: {
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderRadius: theme.radius.full,
          backgroundColor: '#5B34F2',
        },

        priceText: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '900',
        },

        footer: {
          gap: theme.spacing.md,
          paddingBottom: theme.spacing.lg,
          marginTop: theme.spacing.lg,
        },
      }),
    [theme]
  );

  return (
    <GradientBackground variant="vivid">
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.greeting}>
            <Text style={styles.hello}>
              Ola,
            </Text>

            <Text style={styles.name}>
              {user?.username || 'Stranger'}
            </Text>
          </View>

          <Pressable
            style={styles.profile}
            onPress={() => router.push('/profile')}
          >
            <AnimalAvatar
              size={58}
              source={equippedAvatar.image}
            />
          </Pressable>
        </View>

        <Text style={styles.title}>
          Loja de moedas
        </Text>

        <Text style={styles.subtitle}>
          Compre moedas para desbloquear
          recursos especiais e futuros itens exclusivos.
        </Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            Seu saldo atual
          </Text>

          <Text style={styles.balanceValue}>
            🪙 500
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {COIN_PACKS.map((pack) => (
            <Pressable
              key={pack.id}
              style={styles.card}
            >
              <View style={styles.cardLeft}>
                <View style={styles.coinIcon}>
                  <Text style={styles.coinEmoji}>
                    🪙
                  </Text>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.coinAmount}>
                    {pack.coins}
                  </Text>

                  <Text style={styles.bonus}>
                    {pack.bonus}
                  </Text>
                </View>
              </View>

              <Pressable style={styles.priceButton}>
                <Text style={styles.priceText}>
                  {pack.price}
                </Text>
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <PillButton
            title="Voltar para home"
            variant="ghost"
            onPress={() => router.push('/home')}
          />

          <PillButton
            title="Perfil"
            onPress={() => router.push('/profile')}
          />
        </View>
      </View>
    </GradientBackground>
  );
}
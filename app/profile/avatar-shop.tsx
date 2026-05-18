/**
 *  AVATAR SHOP — MeetStranger Mobile
 *
 * Consome o AvatarShopContext global.
 * Caminho: app/profile/avatar-shop.tsx
 */

import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  AnimalAvatar,
  GradientBackground,
  PillButton,
  useTheme,
} from '../../design-system';
import { useAvatarShop, AvatarItem } from '../../hooks/useAvatarShop';

// ==============================
// COMPONENTE: CABEÇALHO
// ==============================

function ShopHeader({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  const theme = useTheme();
  const { coins, equippedAvatar } = useAvatarShop();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing['2xl'],
          paddingTop: theme.spacing['4xl'],
          paddingBottom: theme.spacing.lg,
        },
        backBtn: {
          width: 46,
          height: 46,
          borderRadius: theme.radius.full,
          backgroundColor: 'rgba(255,255,255,0.78)',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.6)',
        },
        backText: {
          fontSize: 22,
          fontWeight: '900',
          color: theme.colors.primaryDark,
          marginTop: -2,
        },
        equippedWrap: {
          alignItems: 'center',
          gap: 2,
        },
        equippedLabel: {
          fontSize: 10,
          fontWeight: '800',
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        },
        coinBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: 'rgba(255,255,255,0.82)',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: 10,
          borderRadius: theme.radius.full,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.6)',
        },
        coinIcon: { fontSize: 17 },
        coinAmount: {
          fontSize: 17,
          fontWeight: '900',
          color: theme.colors.primaryDark,
          minWidth: 36,
          textAlign: 'right',
        },
      }),
    [theme]
  );

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        onPress={onBack}
        accessibilityLabel="Voltar ao perfil"
      >
        <Text style={styles.backText}>‹</Text>
      </Pressable>

      <View style={styles.equippedWrap}>
        <AnimalAvatar source={equippedAvatar.image} size={44} />
        <Text style={styles.equippedLabel}>Equipado</Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/coins')}>
      <View style={styles.coinBadge}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.coinAmount}>{coins}</Text>
      </View>
      </TouchableOpacity>
    </View>
  );
}

// ==============================
// COMPONENTE: CARD DE AVATAR
// ==============================

interface AvatarCardProps {
  avatar: AvatarItem;
}

function AvatarCard({ avatar }: AvatarCardProps) {
  const theme = useTheme();
  const { coins, purchasedIds, equippedId, buyAvatar, equipAvatar } = useAvatarShop();

  const isPurchased = purchasedIds.includes(avatar.id);
  const isEquipped = equippedId === avatar.id;
  const canAfford = coins >= avatar.price;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Borda pulsante quando equipado
  useEffect(() => {
    if (isEquipped) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, { toValue: 1, duration: 900, useNativeDriver: false }),
          Animated.timing(borderAnim, { toValue: 0, duration: 900, useNativeDriver: false }),
        ])
      ).start();
    } else {
      borderAnim.stopAnimation();
      borderAnim.setValue(0);
    }
  }, [isEquipped]);

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, theme.colors.secondary],
  });

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 110, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.0, duration: 90, useNativeDriver: true }),
    ]).start();
  };

  const handleBuy = () => {
    if (isPurchased) return;
    if (!canAfford) {
      Alert.alert(
        '🪙 Moedas insuficientes',
        `Você precisa de ${avatar.price} moedas para obter ${avatar.name}.\nSaldo atual: ${coins} moedas.`
      );
      return;
    }
    Alert.alert(
      `Comprar ${avatar.name}?`,
      `Custo: ${avatar.price} 🪙\nSaldo após compra: ${coins - avatar.price} moedas`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: () => {
            const result = buyAvatar(avatar);
            if (result === 'ok') {
              pulse();
              Alert.alert('✅ Comprado!', `${avatar.name} adicionado à sua coleção!`);
            }
          },
        },
      ]
    );
  };

  const handleEquip = () => {
    pulse();
    equipAvatar(avatar.id);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        cardInner: {
          alignItems: 'center',
          gap: 6,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.sm,
          borderRadius: theme.radius.xl,
          backgroundColor: isEquipped
            ? 'rgba(109,93,251,0.10)'
            : isPurchased
            ? 'rgba(255,255,255,0.78)'
            : 'rgba(255,255,255,0.44)',
          borderWidth: isEquipped ? 2 : 1.5,
        },
        checkBadge: {
          position: 'absolute',
          top: -6,
          right: -6,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#fff',
        },
        checkText: {
          color: '#fff',
          fontSize: 11,
          fontWeight: '900',
          lineHeight: 14,
        },
        avatarName: {
          color: theme.colors.textPrimary,
          fontSize: 11,
          fontWeight: '900',
          textAlign: 'center',
          letterSpacing: 0.3,
        },
        priceRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
        },
        priceText: {
          fontSize: 12,
          fontWeight: '800',
          color: isPurchased
            ? theme.colors.success
            : canAfford
            ? theme.colors.primaryDark
            : theme.colors.textTertiary,
        },
        freeTag: {
          backgroundColor: 'rgba(16,185,129,0.15)',
          paddingHorizontal: 7,
          paddingVertical: 2,
          borderRadius: 5,
        },
        freeText: {
          color: theme.colors.success,
          fontSize: 10,
          fontWeight: '900',
          letterSpacing: 0.4,
        },
        btn: {
          width: '100%',
          paddingVertical: 7,
          borderRadius: theme.radius.lg,
          alignItems: 'center',
          backgroundColor: isEquipped
            ? theme.colors.success
            : isPurchased
            ? theme.colors.primary
            : canAfford
            ? theme.colors.primaryDark
            : 'rgba(150,150,160,0.35)',
        },
        btnText: {
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.3,
        },
        btnTextDisabled: {
          color: 'rgba(100,100,110,0.75)',
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.3,
        },
      }),
    [theme, isEquipped, isPurchased, canAfford]
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '30%', minWidth: 96 }}>
      <Animated.View
        style={[
          styles.cardInner,
          {
            borderColor: isEquipped
              ? animatedBorderColor
              : isPurchased
              ? 'rgba(109,93,251,0.3)'
              : 'rgba(255,255,255,0.5)',
          },
        ]}
      >
        {isEquipped && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}

        <AnimalAvatar source={avatar.image} size={76} />

        <Text style={styles.avatarName}>{avatar.name}</Text>

        {avatar.price === 0 ? (
          <View style={styles.freeTag}>
            <Text style={styles.freeText}>GRÁTIS</Text>
          </View>
        ) : isPurchased ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>✓ Obtido</Text>
          </View>
        ) : (
          <View style={styles.priceRow}>
            <Text style={{ fontSize: 12 }}>🪙</Text>
            <Text style={styles.priceText}>{avatar.price}</Text>
          </View>
        )}

        {isEquipped ? (
          <View style={styles.btn}>
            <Text style={styles.btnText}>Equipado ✓</Text>
          </View>
        ) : isPurchased ? (
          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.8 : 1 }]}
            onPress={handleEquip}
            accessibilityLabel={`Equipar ${avatar.name}`}
          >
            <Text style={styles.btnText}>Equipar</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.8 : 1 }]}
            onPress={handleBuy}
            accessibilityLabel={`Comprar ${avatar.name} por ${avatar.price} moedas`}
          >
            <Text style={canAfford ? styles.btnText : styles.btnTextDisabled}>
              {canAfford ? 'Comprar' : 'Sem moedas'}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  );
}

// ==============================
// TELA PRINCIPAL
// ==============================

export default function AvatarShop() {
  const router = useRouter();
  const theme = useTheme();
  const { coins, purchasedIds, avatars, equippedId, isLoaded } = useAvatarShop();

  const equippedName = avatars.find((a) => a.id === equippedId)?.name ?? '—';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        flex: { flex: 1 },
        titleSection: {
          paddingHorizontal: theme.spacing['2xl'],
          paddingBottom: theme.spacing.md,
        },
        title: {
          color: theme.colors.textPrimary,
          fontSize: 28,
          lineHeight: 34,
          fontWeight: '900',
          marginBottom: 4,
        },
        subtitle: {
          color: theme.colors.textSecondary,
          fontSize: 13,
          fontWeight: '700',
          lineHeight: 19,
        },
        divider: {
          height: 1,
          backgroundColor: 'rgba(109,93,251,0.12)',
          marginHorizontal: theme.spacing['2xl'],
          marginBottom: theme.spacing.lg,
        },
        statsRow: {
          flexDirection: 'row',
          gap: theme.spacing.md,
          marginHorizontal: theme.spacing['2xl'],
          marginBottom: theme.spacing.xl,
        },
        statChip: {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 10,
          borderRadius: theme.radius.lg,
          backgroundColor: 'rgba(255,255,255,0.72)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.55)',
          gap: 2,
        },
        statValue: {
          fontSize: 15,
          fontWeight: '900',
          color: theme.colors.primaryDark,
        },
        statLabel: {
          fontSize: 10,
          fontWeight: '700',
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        },
        scrollContent: {
          paddingHorizontal: theme.spacing['2xl'],
          paddingBottom: theme.spacing['4xl'],
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.spacing.md,
        },
        loadingWrap: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        loadingText: {
          color: theme.colors.textSecondary,
          fontSize: 15,
          fontWeight: '700',
        },
        footer: {
          paddingHorizontal: theme.spacing['2xl'],
          paddingBottom: theme.spacing['2xl'],
        },
      }),
    [theme]
  );

  if (!isLoaded) {
    return (
      <GradientBackground variant="closeup">
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Carregando loja...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="closeup">
      <View style={styles.flex}>
        <ShopHeader onBack={() => router.back()} />

        <View style={styles.titleSection}>
          <Text style={styles.title}>Avatar Shop </Text>
          <Text style={styles.subtitle}>
            Colete e equipe avatares com suas moedas.
          </Text>
        </View>

        <View style={styles.divider} />

        
        <View style={styles.statsRow}>
          <TouchableOpacity onPress={() => router.push('/coins')}>
          <View style={styles.statChip} >
            <Text style={styles.statValue}>🪙 {coins}</Text>
            <Text style={styles.statLabel}>Moedas</Text>
          </View>
          </TouchableOpacity>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>
              {purchasedIds.length}/{avatars.length}
            </Text>
            <Text style={styles.statLabel}>Coletados</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statValue} numberOfLines={1}>{equippedName}</Text>
            <Text style={styles.statLabel}>Ativo</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {avatars.map((avatar) => (
              <AvatarCard key={avatar.id} avatar={avatar} />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PillButton
            title="Voltar ao perfil"
            variant="primary"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </GradientBackground>
  );
}
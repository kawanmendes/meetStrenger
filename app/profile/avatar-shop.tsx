import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimalAvatar, GradientBackground, PillButton, useTheme } from '../../design-system';
import { appImages } from '../../constants/assets';

const avatars = [
  { id: '1', image: appImages.perfil1, name: 'Avatar 1' },
  { id: '2', image: appImages.perfil2, name: 'Avatar 2' },
  { id: '3', image: appImages.perfil3, name: 'Avatar 3' },
  { id: '4', image: appImages.perfil4, name: 'Avatar 4' },
  { id: '5', image: appImages.perfil5, name: 'Avatar 5' },
  { id: '6', image: appImages.perfil6, name: 'Avatar 6' },
  { id: '7', image: appImages.perfil7, name: 'Avatar 7' },
  { id: '8', image: appImages.perfil8, name: 'Avatar 8' },
  { id: '9', image: appImages.perfil9, name: 'Avatar 9' },
];

export default function AvatarShop() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing['2xl'],
      paddingTop: theme.spacing['4xl'],
      paddingBottom: theme.spacing['2xl'],
    },
    title: {
      color: '#FFFFFF',
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '900',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      color: 'rgba(255,255,255,0.82)',
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '700',
      marginBottom: theme.spacing['2xl'],
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing['2xl'],
    },
    item: {
      width: '30%',
      minWidth: 92,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    label: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '900',
    },
    footer: {
      gap: theme.spacing.md,
    },
  }), [theme]);

  return (
    <GradientBackground variant="closeup">
      <View style={styles.container}>
        <Text style={styles.title}>Avatar shop</Text>
        <Text style={styles.subtitle}>Estrutura pronta para receber PNG/SVG exportados do prototipo.</Text>
        <ScrollView contentContainerStyle={styles.grid}>
          {avatars.map((avatar) => (
            <View key={avatar.id} style={styles.item}>
              <AnimalAvatar source={avatar.image} size={86} />
              <Text style={styles.label}>{avatar.name}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <PillButton title="Voltar ao perfil" variant="primary" onPress={() => router.back()} />
        </View>
      </View>
    </GradientBackground>
  );
}

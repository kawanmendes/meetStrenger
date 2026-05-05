import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';

interface AnimalAvatarProps {
  source?: ImageSourcePropType;
  animal?: string;
  size?: number;
  style?: ViewStyle;
}

export function AnimalAvatar({ source, animal = 'MS', size = 104, style }: AnimalAvatarProps) {
  const theme = useTheme();
  const styles = useMemo(() => StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.88)',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.72)',
      overflow: 'hidden',
      ...(getShadow(theme.shadows.glass)),
    },
    image: {
      width: '78%',
      height: '78%',
    },
    initials: {
      color: theme.colors.primaryDark,
      fontSize: Math.max(18, size * 0.28),
      fontWeight: '900',
    },
  }), [size, theme]);

  return (
    <View style={[styles.avatar, style]}>
      {source ? <Image source={source} style={styles.image} resizeMode="contain" /> : <Text style={styles.initials}>{animal}</Text>}
    </View>
  );
}

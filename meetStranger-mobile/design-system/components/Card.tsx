import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'clay';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function Card({ children, variant = 'default', padding = 'lg', onPress, style, disabled = false }: CardProps) {
  const theme = useTheme();
  const styles = useMemo(() => StyleSheet.create({
    base: {
      padding: theme.spacing[padding],
      borderRadius: theme.radius.lg,
      backgroundColor: variant === 'outlined' ? 'transparent' : theme.colors.surface,
      borderWidth: variant === 'outlined' || variant === 'clay' ? 1 : 0,
      borderColor: theme.colors.border,
      opacity: disabled ? theme.opacity.disabled : 1,
      ...(variant === 'default' ? {} : getShadow(theme.shadows.glass)),
    },
  }), [disabled, padding, theme, variant]);

  if (onPress) {
    return (
      <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, pressed && { transform: [{ scale: 0.99 }] }, style]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.base, style]}>{children}</View>;
}

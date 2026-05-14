import React, { useMemo } from 'react';
import { Animated, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';
import { usePressAnimation } from '../animations/interactions';

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
  const pressAnimation = usePressAnimation(0.99);
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
      <Animated.View style={[pressAnimation.pressStyle, style]}>
        <Pressable
          disabled={disabled}
          onPress={onPress}
          onPressIn={pressAnimation.onPressIn}
          onPressOut={pressAnimation.onPressOut}
          style={styles.base}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={[styles.base, style]}>{children}</View>;
}

import React, { useMemo } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';
import { usePressAnimation } from '../animations/interactions';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'glass' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PillButton({ title, onPress, variant = 'glass', disabled = false, loading = false, style, textStyle }: PillButtonProps) {
  const theme = useTheme();
  const pressAnimation = usePressAnimation(0.98);
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const styles = useMemo(() => StyleSheet.create({
    pressable: {
      borderRadius: theme.radius.full,
      overflow: 'hidden',
      opacity: disabled ? theme.opacity.disabled : 1,
      ...(variant === 'ghost' ? {} : getShadow(theme.shadows.glass)),
    },
    content: {
      minHeight: 56,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing['2xl'],
      borderRadius: theme.radius.full,
      borderWidth: variant === 'ghost' ? 0 : 1,
      borderColor: theme.colors.border,
      backgroundColor: isDanger ? theme.colors.error : isPrimary ? theme.colors.primary : theme.colors.surface,
    },
    text: {
      color: isDanger || isPrimary ? '#FFFFFF' : theme.colors.primaryDark,
      fontSize: 16,
      fontWeight: '900',
      lineHeight: 20,
      textAlign: 'center',
    },
  }), [disabled, isDanger, isPrimary, theme, variant]);

  const content = (
    <Text style={[styles.text, textStyle]}>{loading ? 'Carregando...' : title}</Text>
  );

  return (
    <Animated.View style={[pressAnimation.pressStyle, style]}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={pressAnimation.onPressIn}
        onPressOut={pressAnimation.onPressOut}
        style={styles.pressable}
      >
        {isPrimary ? (
          <LinearGradient colors={theme.gradients.primaryButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.content}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : content}
          </LinearGradient>
        ) : (
          <View style={styles.content}>
            {loading ? <ActivityIndicator color={theme.colors.primaryDark} /> : content}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

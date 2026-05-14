import React, { useMemo } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';
import { usePressAnimation } from '../animations/interactions';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'clay';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button(props: ButtonProps) {
  return <PillCompatButton {...props} />;
}

function PillCompatButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const theme = useTheme();
  const pressAnimation = usePressAnimation(0.98);
  const isPrimary = variant === 'primary' || variant === 'clay';
  const isDanger = variant === 'danger';

  const styles = useMemo(() => StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'lg' ? 58 : size === 'sm' ? 42 : 52,
      paddingHorizontal: size === 'lg' ? theme.spacing['2xl'] : theme.spacing.xl,
      paddingVertical: size === 'sm' ? theme.spacing.sm : theme.spacing.md,
      borderRadius: theme.radius.full,
      borderWidth: variant === 'ghost' ? 0 : 1,
      borderColor: isPrimary ? theme.colors.borderLight : theme.colors.border,
      backgroundColor: isDanger
        ? theme.colors.error
        : isPrimary
          ? theme.colors.surfaceElevated
          : variant === 'ghost'
            ? 'transparent'
            : theme.colors.surface,
      opacity: disabled ? theme.opacity.disabled : 1,
      ...(variant === 'ghost' ? {} : getShadow(theme.shadows.glass)),
    },
    fullWidth: {
      width: '100%',
    },
    text: {
      fontSize: size === 'lg' ? 17 : size === 'sm' ? 13 : 15,
      lineHeight: size === 'lg' ? 22 : 18,
      fontWeight: '800',
      color: isDanger
        ? '#FFFFFF'
        : isPrimary
          ? theme.colors.primaryDark
          : theme.colors.textPrimary,
      textAlign: 'center',
    },
  }), [disabled, isDanger, isPrimary, size, theme, variant]);

  return (
    <Animated.View style={[pressAnimation.pressStyle, fullWidth && styles.fullWidth, style]}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={pressAnimation.onPressIn}
        onPressOut={pressAnimation.onPressOut}
        style={[styles.button, fullWidth && styles.fullWidth]}
      >
        {loading ? (
          <ActivityIndicator color={isDanger ? '#FFFFFF' : theme.colors.primaryDark} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

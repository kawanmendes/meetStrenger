import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../design-system';
import { Colors as colors } from '../design-system/tokens/colors';
import { claySoft, clayMedium } from '../design-system/tokens/shadows';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', disabled = false, style }: ButtonProps) {
  const { spacing, radius } = useTheme();

  const styles = StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.lg,
      minHeight: 48,
    },
    primary: {
      backgroundColor: colors.primary,
      ...clayMedium,
    },
    secondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...claySoft,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryText: {
      color: colors.background,
    },
    secondaryText: {
      color: colors.textPrimary,
    },
    outlineText: {
      color: colors.primary,
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
 
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';

export type InputVariant = 'default' | 'clay';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
}

export function Input({ label, error, helperText, style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      color: isFocused ? theme.colors.primaryDark : theme.colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    input: {
      minHeight: 54,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : isFocused ? theme.colors.primaryLight : theme.colors.border,
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      ...(getShadow(theme.shadows.glass)),
    },
    helper: {
      color: error ? theme.colors.error : theme.colors.textSecondary,
      fontSize: 12,
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
  }), [error, isFocused, theme]);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textTertiary}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        style={[styles.input, style]}
      />
      {error || helperText ? <Text style={styles.helper}>{error || helperText}</Text> : null}
    </View>
  );
}

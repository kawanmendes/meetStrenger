import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getShadow } from '../tokens/shadows';

interface PillInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function PillInput({ label, error, style, ...props }: PillInputProps) {
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const styles = useMemo(() => StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 13,
      fontWeight: '900',
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    input: {
      minHeight: 56,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : focused ? 'rgba(255,255,255,0.9)' : theme.colors.border,
      backgroundColor: 'rgba(255,255,255,0.82)',
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      ...(getShadow(theme.shadows.glass)),
    },
    error: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
    },
  }), [error, focused, theme]);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textTertiary}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        style={[styles.input, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

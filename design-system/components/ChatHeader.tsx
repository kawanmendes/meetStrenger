import React, { useMemo } from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AnimalAvatar } from './AnimalAvatar';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onNext?: () => void;
  avatarSource?: ImageSourcePropType;
  showActions?: boolean;
}

export function ChatHeader({ title, subtitle, onBack, onNext, avatarSource, showActions = false }: ChatHeaderProps) {
  const theme = useTheme();
  const styles = useMemo(() => StyleSheet.create({
    header: {
      minHeight: 76,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.28)',
    },
    back: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.78)',
    },
    backText: { color: theme.colors.primaryDark, fontSize: 22, fontWeight: '900' },
    textWrap: { flex: 1 },
    title: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
    subtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: '700', marginTop: 2 },
    actions: { flexDirection: 'row', gap: theme.spacing.xs },
    actionBtn: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    exitBtn: {
      backgroundColor: 'rgba(239,68,68,0.16)',
      borderColor: 'rgba(239,68,68,0.6)',
    },
    nextBtn: {
      backgroundColor: 'rgba(34,197,94,0.16)',
      borderColor: 'rgba(34,197,94,0.6)',
    },
    actionText: { fontSize: 20, fontWeight: '900' },
  }), [theme]);

  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{'<'}</Text>
      </Pressable>
      <AnimalAvatar size={44} source={avatarSource} animal="MS" />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {showActions && (
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onBack} style={[styles.actionBtn, styles.exitBtn]}>
            <Text style={styles.actionText}>✕</Text>
          </Pressable>
          {onNext && (
            <Pressable accessibilityRole="button" onPress={onNext} style={[styles.actionBtn, styles.nextBtn]}>
              <Text style={styles.actionText}>→</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

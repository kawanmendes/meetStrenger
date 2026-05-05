import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export type ChatBubblePosition = 'left' | 'right';

interface ChatBubbleProps {
  message: string;
  position: ChatBubblePosition;
  timestamp?: string;
  username?: string;
  showUsername?: boolean;
}

export function ChatBubble({ message, position, timestamp, username, showUsername = false }: ChatBubbleProps) {
  const theme = useTheme();
  const isUser = position === 'right';
  const styles = useMemo(() => StyleSheet.create({
    container: {
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    username: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    bubble: {
      maxWidth: '82%',
      borderRadius: theme.radius.chatBubble,
      borderBottomRightRadius: isUser ? theme.spacing.xs : theme.radius.chatBubble,
      borderBottomLeftRadius: isUser ? theme.radius.chatBubble : theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: isUser ? theme.colors.chat.userBubble : theme.colors.chat.otherBubble,
      borderWidth: isUser ? 0 : 1,
      borderColor: theme.colors.border,
    },
    message: {
      color: isUser ? theme.colors.chat.userText : theme.colors.chat.otherText,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: '600',
    },
    timestamp: {
      color: isUser ? 'rgba(255,255,255,0.72)' : theme.colors.textTertiary,
      fontSize: 11,
      marginTop: theme.spacing.xs,
      textAlign: isUser ? 'right' : 'left',
    },
  }), [isUser, theme]);

  return (
    <View style={styles.container}>
      {showUsername && username && !isUser ? <Text style={styles.username}>{username}</Text> : null}
      <View style={styles.bubble}>
        <Text style={styles.message}>{message}</Text>
        {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
      </View>
    </View>
  );
}

import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChatBubble, ChatHeader, GradientBackground, PillButton, useTheme } from '../../design-system';
import { useChat } from '../../hooks/useChat';
import { appImages } from '../../constants/assets';

export default function Room() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams<{ category?: string }>();
  const category = params.category || 'general';
  const chat = useChat(category);
  const [message, setMessage] = useState('');

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    messages: {
      flex: 1,
    },
    messagesContent: {
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.24)',
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    input: {
      flex: 1,
      minHeight: 52,
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.lg,
      color: theme.colors.textPrimary,
      backgroundColor: 'rgba(255,255,255,0.86)',
      fontSize: 15,
      fontWeight: '700',
    },
    send: {
      minWidth: 104,
    },
  }), [theme]);

  const handleSend = () => {
    if (!message.trim()) return;
    chat.sendMessage(message);
    setMessage('');
  };

  const subtitle = chat.isMatching
    ? 'Procurando alguem...'
    : chat.isConnected
      ? `Conectado com ${chat.partnerName}`
      : 'Preparando chat';

  return (
    <GradientBackground variant="bubbles">
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ChatHeader title={`Chat ${category}`} subtitle={subtitle} avatarSource={appImages.mascot} onBack={() => router.replace('/home')} />
        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
          {chat.messages.map((item) => (
            <ChatBubble
              key={item.id}
              message={item.text}
              position={item.isUser ? 'right' : 'left'}
              username={item.userName}
              showUsername
              timestamp={item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Digite sua mensagem"
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.input}
            onSubmitEditing={handleSend}
          />
          <PillButton title="Enviar" variant="primary" onPress={handleSend} style={styles.send} />
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

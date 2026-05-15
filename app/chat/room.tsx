import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatBubble, ChatHeader, GradientBackground, PillButton, usePulseAnimation, useTheme } from '../../design-system';
import { useChat } from '../../hooks/useChat';
import { appImages } from '../../constants/assets';
import { CATEGORIES } from '../../constants/categories';
import { logger } from '../../services/logger';

export default function Room() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const hasLeftRef = useRef(false);
  const params = useLocalSearchParams<{ category?: string }>();

  const categoryParam = String(params.category ?? '');
  const category = CATEGORIES.some((cat) => cat.id === categoryParam) ? categoryParam as typeof CATEGORIES[number]['id'] : null;

  useEffect(() => {
    if (!category) {
      logger.room.log('Invalid category');
      router.replace('/home');
    }
  }, [category, router]);

  if (!category) return null;

  const chat = useChat(category);
  const [message, setMessage] = useState('');
  const thinkingPulse = usePulseAnimation(1300);

  const cleanupChat = useCallback(() => {
    if (hasLeftRef.current) return;
    hasLeftRef.current = true;
    chat.leaveAndReset();
  }, [chat.leaveAndReset]);

  const handleBack = useCallback(() => {
    cleanupChat();
    router.replace('/home');
  }, [cleanupChat, router]);

  useEffect(() => {
    return cleanupChat;
  }, [cleanupChat]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chat.messages]);

  useEffect(() => {
    if (!chat.isConnected && chat.isMatching) {
      thinkingPulse.startPulse();
    }

    return thinkingPulse.stopPulse;
  }, [chat.isConnected, chat.isMatching, thinkingPulse.startPulse, thinkingPulse.stopPulse]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1 },
    messages: { flex: 1 },
    messagesContent: { paddingVertical: theme.spacing.lg, gap: theme.spacing.xs, paddingBottom: 32 + insets.bottom },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: Math.max(theme.spacing.lg, insets.bottom + theme.spacing.sm),
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
    send: { minWidth: 104 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: theme.spacing.sm },
    thinkingImage: { width: 220, height: 220, resizeMode: 'contain', marginBottom: theme.spacing.sm },
    infoText: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  }), [theme, insets.bottom]);

  const handleSend = () => {
    if (!message.trim() || !chat.isConnected) return;
    chat.sendMessage(message);
    setMessage('');
  };

  const handleNext = () => {
    chat.skipToNext();
  };

  const subtitle = chat.isMatching ? 'Procurando alguém...' : chat.isConnected ? `Conectado com ${chat.partnerName}` : 'Preparando chat...';

  return (
    <GradientBackground variant="bubbles">
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ChatHeader title={`Chat ${category}`} subtitle={subtitle} avatarSource={appImages.mascot} onBack={handleBack} onNext={handleNext} showActions={chat.isConnected} />

        {!chat.isConnected && chat.isMatching && (
          <View style={styles.center}>
            <Animated.Image source={appImages.pensando} style={[styles.thinkingImage, thinkingPulse.pulseStyle]} />
            <Text style={styles.infoText}>Procurando alguém...</Text>
            {chat.queuePosition && <Text style={styles.infoText}>Fila: {chat.queuePosition}</Text>}
            {chat.estimatedWait ? <Text style={styles.infoText}>Espera: {chat.estimatedWait}</Text> : null}
          </View>
        )}

        {chat.isConnected && (
          <>
            <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
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
              {chat.partnerTyping && <Text style={styles.infoText}>digitando...</Text>}
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
          </>
        )}
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

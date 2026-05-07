import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  ChatBubble,
  ChatHeader,
  GradientBackground,
  PillButton,
  useTheme,
} from '../../design-system';

import { useChat } from '../../hooks/useChat';

import { appImages } from '../../constants/assets';

// =========================
// VALID CATEGORIES
// =========================

const VALID_CATEGORIES = [
  'movies',
  'gaming',
  'music',
  'study',
];

// =========================
// COMPONENT
// =========================

export default function Room() {

  const router = useRouter();

  const theme = useTheme();

  const scrollRef =
    useRef<ScrollView>(null);

  const params =
    useLocalSearchParams<{
      category?: string;
    }>();

  // =========================
  // CATEGORY VALIDATION
  // =========================

  const category =
    VALID_CATEGORIES.includes(
      String(params.category)
    )
      ? String(params.category)
      : null;

  // categoria inválida
  useEffect(() => {

    if (!category) {

      console.log(
        '[ROOM] Invalid category'
      );

      router.replace('/home');
    }

  }, [category]);

  // evita render quebrado
  if (!category) {
    return null;
  }

  // =========================
  // CHAT
  // =========================

  const chat =
    useChat(category);

  // =========================
  // MESSAGE STATE
  // =========================

  const [message, setMessage] =
    useState('');

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {

    scrollRef.current?.scrollToEnd({
      animated: true,
    });

  }, [chat.messages]);

  // =========================
  // STYLES
  // =========================

  const styles = useMemo(
    () =>
      StyleSheet.create({

        container: {
          flex: 1,
        },

        messages: {
          flex: 1,
        },

        messagesContent: {
          paddingVertical:
            theme.spacing.lg,

          gap: theme.spacing.xs,

          paddingBottom: 32,
        },

        footer: {

          flexDirection: 'row',

          alignItems: 'center',

          gap: theme.spacing.sm,

          padding:
            theme.spacing.lg,

          borderTopWidth: 1,

          borderTopColor:
            'rgba(255,255,255,0.24)',

          backgroundColor:
            'rgba(255,255,255,0.16)',
        },

        input: {

          flex: 1,

          minHeight: 52,

          borderRadius:
            theme.radius.full,

          paddingHorizontal:
            theme.spacing.lg,

          color:
            theme.colors.textPrimary,

          backgroundColor:
            'rgba(255,255,255,0.86)',

          fontSize: 15,

          fontWeight: '700',
        },

        send: {
          minWidth: 104,
        },

        center: {

          flex: 1,

          alignItems: 'center',

          justifyContent: 'center',

          padding: 24,
        },

        infoText: {

          color:
            theme.colors.textPrimary,

          fontSize: 16,

          fontWeight: '700',

          textAlign: 'center',
        },
      }),
    [theme]
  );

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = () => {

    if (
      !message.trim() ||
      !chat.isConnected
    ) {
      return;
    }

    chat.sendMessage(message);

    setMessage('');
  };

  // =========================
  // SUBTITLE
  // =========================

  const subtitle =
    chat.isMatching

      ? 'Procurando alguém...'

      : chat.isConnected

      ? `Conectado com ${chat.partnerName}`

      : 'Preparando chat...';

  // =========================
  // RENDER
  // =========================

  return (
    <GradientBackground variant="bubbles">

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >

        <ChatHeader
          title={`Chat ${category}`}
          subtitle={subtitle}
          avatarSource={appImages.mascot}
          onBack={() => router.replace('/home')}
        />

        {/* MATCHING */}
        {!chat.isConnected &&
          chat.isMatching && (

          <View style={styles.center}>

            <Text style={styles.infoText}>
              Procurando alguém...
            </Text>

            {chat.queuePosition && (
              <Text style={styles.infoText}>
                Fila: {chat.queuePosition}
              </Text>
            )}

            {chat.estimatedWait ? (
              <Text style={styles.infoText}>
                Espera: {chat.estimatedWait}
              </Text>
            ) : null}

          </View>
        )}

        {/* CHAT */}
        {chat.isConnected && (

          <>
            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={
                styles.messagesContent
              }
            >

              {chat.messages.map(
                (item) => (

                  <ChatBubble
                    key={item.id}
                    message={item.text}
                    position={
                      item.isUser
                        ? 'right'
                        : 'left'
                    }
                    username={item.userName}
                    showUsername
                    timestamp={item.timestamp.toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  />
                )
              )}

              {/* typing */}
              {chat.partnerTyping && (
                <Text
                  style={styles.infoText}
                >
                  digitando...
                </Text>
              )}

            </ScrollView>

            <View style={styles.footer}>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Digite sua mensagem"
                placeholderTextColor={
                  theme.colors.textTertiary
                }
                style={styles.input}
                onSubmitEditing={
                  handleSend
                }
              />

              <PillButton
                title="Enviar"
                variant="primary"
                onPress={handleSend}
                style={styles.send}
              />

            </View>
          </>
        )}

      </KeyboardAvoidingView>

    </GradientBackground>
  );
}
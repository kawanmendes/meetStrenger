import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimalAvatar, GradientBackground, PillButton, PillInput, useTheme } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { appImages } from '../../constants/assets';
import { mockUser } from '../../constants/mock';

export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState('mock123');

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['3xl'],
      gap: theme.spacing.md,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: 'rgba(255,255,255,0.84)',
      fontSize: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
    form: {
      gap: theme.spacing.xs,
    },
  }), [theme]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    const success = await login(email.trim(), password);
    if (success) {
      router.replace('/home');
      return;
    }

    Alert.alert('Erro', 'Credenciais invalidas. Tente novamente.');
  };

  return (
    <GradientBackground variant="closeup">
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          <View style={styles.header}>
            <AnimalAvatar source={appImages.mascot} size={118} />
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Use sua conta para encontrar novas conversas.</Text>
          </View>
          <View style={styles.form}>
            <PillInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" />
            <PillInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="Sua senha" />
            <PillButton title="Entrar" variant="primary" onPress={handleLogin} loading={isLoading} />
            <PillButton title="Criar conta" onPress={() => router.push('/auth/register')} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

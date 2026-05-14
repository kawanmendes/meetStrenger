import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AnimalAvatar, GradientBackground, PillButton, PillInput, themeDark, useTheme } from '../../design-system';
import { useAuth } from '../../hooks/useAuth';
import { appImages } from '../../constants/assets';

export default function Register() {
  const router = useRouter();
  const theme = useTheme();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const styles = useMemo(() => StyleSheet.create({
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing['2xl'],
      paddingVertical: theme.spacing['4xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing['2xl'],
      gap: theme.spacing.md,
    },
    title: {
      color: theme.colors.primary,
      fontSize: 30,
      lineHeight: 36,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
    form: {
      gap: theme.spacing.xs,
    },
  }), [theme]);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (password.length < 6 || password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas devem coincidir e ter pelo menos 6 caracteres.');
      return;
    }

    const success = await register(name.trim(), email.trim(), password);
    if (success) {
      router.replace('/home');
      return;
    }

    Alert.alert('Erro', 'Nao foi possivel registrar. Tente novamente.');
  };

  return (
    <GradientBackground variant="soft">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <AnimalAvatar source={appImages.mascot_register} size={250} />
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Escolha um apelido e comece a conversar.</Text>
          </View>
          <View style={styles.form}>
            <PillInput label="Nome"   value={name} onChangeText={setName} placeholder="Seu apelido" />
            <PillInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="seu@email.com" />
            <PillInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimo 6 caracteres" />
            <PillInput label="Confirmar senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Repita sua senha" />
            <PillButton title="Registrar" variant="primary" onPress={handleRegister} loading={isLoading} />
            <PillButton title="Ja tenho conta" onPress={() => router.push('/auth/login')} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

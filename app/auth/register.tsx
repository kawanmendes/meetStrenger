import { Text, View, Alert, KeyboardAvoidingView, Platform, Image, StyleSheet } from 'react-native'; 
//import {useAuth} from '../../hooks/useAuth';
import React, {useState} from 'react';
import {useRouter} from 'expo-router'
import { Input, Button, useTheme } from '../../design-system';

export default function Register() { 
    const router = useRouter();
    const { colors, spacing, clay, radius } = useTheme();
    // const {Register} = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            flex: 1,
            paddingHorizontal: spacing.xl,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: spacing['4xl'],
        },
        logo: {
            width: 120,
            height: 120,
            marginBottom: spacing.xl,
            ...clay.combined,
            borderRadius: radius.full,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: spacing.sm,
            letterSpacing: -0.2,
            lineHeight: 26,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: spacing['4xl'],
            lineHeight: 22,
            textAlign: 'center',
        },
        inputContainer: {
            width: '100%',
        },
        registerButton: {
            marginBottom: spacing.sm,
            marginTop: spacing.xl,
        },
    });

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem ou são muito curtas. Tente novamente.');
            return;
        }
        try {
            // const success = await Register(name, email, password);
            // if (success) {
            // } else {
            //      Alert.alert('Erro', 'Nao foi possivel registrar. Tente novamente.);
            //}
            router.replace('/home');
        } catch (error){
            Alert.alert('Error', 'Ocorreu um erro ao tentar registrar. Tente novamente.')
        }
    };

return(
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === "android" ? -85 : 0}
        style={styles.container}
    >
            <View style={styles.content}>
                <Image source={require('../../assets/favicon.png')}
                resizeMode='contain'
                style={styles.logo}/>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Junte-se ao MeetStranger</Text>
            <View style={styles.inputContainer}>
                <Input
                    label='Nome'
                    value={name}
                    onChangeText={setName}
                    placeholder='Seu nome de usuario'
                    variant='clay'
                />
                <Input
                    label='Email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    placeholder='seu@email.com'
                    variant='clay'
                    />
                <Input
                    label='Senha'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder='********'
                    variant='clay'
                    />
                <Input
                    label='Confirmar Senha'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder='********'
                    variant='clay'
                    />
            </View>
              <Button
                title={loading ? 'Registrando...' : 'Registrar'}
                variant='clay'
                onPress={handleRegister}
                disabled={loading}
                style={styles.registerButton}
                />
            <Button 
                title='Ja tem conta? Faça login'
                onPress={() => router.push('/auth/login')}
                variant='secondary'
                />
</View>
    </KeyboardAvoidingView> 
); 
}
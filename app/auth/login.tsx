import { Text, View, Alert, KeyboardAvoidingView, Platform, Image, StyleSheet } from 'react-native'; 
import React, {useState} from 'react';
import {useRouter} from 'expo-router';
import { Input, Button, useTheme } from '../../design-system';

// import { useAuth} from '../../hooks/useAuth';

export default function Login() { 
    const router = useRouter();
    const { colors, spacing, clay, radius } = useTheme();
    //const {Login} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, _setLoading] = useState (false);
    
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
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: spacing.xl,
            textAlign: 'center',
        },
        inputContainer: {
            width: '100%',
            marginBottom: spacing.lg,
        },
        loginButton: {
            marginBottom: spacing.sm,
        },
    });

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por Favor, preencha todos os campos.');
            return;
        }
        try {
            // const sucess = await Login(email, password);
            // if (success) {
            // } else {
            // Alert.alert('Error', 'credenciais invalidas. tente novamente.');
            // }
            router.replace('/home');
        } catch (error) {
            Alert.alert('erro', 'ocorreu um erro ao tentar fazer login. tente novamente.')
        }
    };
    
return ( 
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === "android" ? -85 : 0}
        >
            <View style={styles.content}>
                <Image source={require('../../assets/favicon.png')} style={styles.logo} resizeMode='contain'/>
                <Text style={styles.title}>Bem-vindo ao app MeetStranger!</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>
                <View style={styles.inputContainer}>
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
                    <Button
                    title='Login'
                    variant='clay'
                    onPress={handleLogin}
                    disabled={loading}
                    style={styles.loginButton}
                    />
                    <Button
                    title='Criar conta'
                    onPress={() => router.push('/auth/register')}
                    variant='secondary'
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
); 
}
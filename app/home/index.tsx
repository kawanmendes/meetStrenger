import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, useTheme } from '../../design-system';
import { useRouter } from 'expo-router';
//import { useAAuth} from '../..hooks/useAuth';
import React from 'react';

export default function Home() {
    const router = useRouter();
    const { colors, spacing, clay, radius } = useTheme();
    // const { user, Logout } = useAuth();
    const user = { username: 'Kawan' }; //remover após implementação

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingTop: spacing['4xl'],
            paddingBottom: spacing.xl,
            paddingHorizontal: spacing.lg,
            alignItems: 'center',
        },
        logo: {
            width: 120,
            height: 120,
            marginBottom: spacing.xl,
            borderRadius: radius.full,
        },
        welcome: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: spacing.sm,
            letterSpacing: -0.1,
            textAlign: 'center',
        },
        subTitle: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            textAlign: 'center',
        },
        content: {
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
        },
        cardContainer: {
            marginBottom: spacing.lg,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: spacing.md,
            letterSpacing: -0.2,
        },
        cardDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        featureRow: {
            marginBottom: spacing.lg,
        },
        feature: {
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        featureIcon: {
            fontSize: 28,
            marginBottom: spacing.xs,
        },
        featureText: {
            fontSize: 12,
            color: colors.primary,
            fontWeight: '500',
            textAlign: 'center',
        },
        buttonsContainer: {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing['4xl'],
            gap: spacing.sm,
        },
        button: {
            marginBottom: spacing.sm,
        },
    });

    const handleStartChat = () => {
        router.push('/chat/select');
    }
    const handleAbout = () => {
        router.push('/about');
    }
    const handleLogout = async () => {
        // await Logout();
        router.replace('/auth/login');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../../assets/favicon.png')}
                    resizeMode='contain'
                />
                <Text style={styles.welcome}>Bem-vindo, {user?.username || 'Stranger'}</Text>
                <Text style={styles.subTitle}>Pronto para se conectar com novas pessoas?</Text>
            </View>

            <ScrollView style={styles.content}>
                <Card variant='clay' padding='lg' style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>MeetStranger</Text>
                    <Text style={styles.cardDescription}>Converse com pessoas ao redor do mundo e encontre pessoas que tenha os mesmos interesses que você!!!</Text>
                </Card>

                <View style={styles.featureRow}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🫦</Text>
                        <Text style={styles.featureText}>Explore o mundo através do MeetStranger</Text>
                    </View>

                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>😘</Text>
                        <Text style={styles.featureText}>Converse com pessoas ao redor do mundo de forma rápida e fácil</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonsContainer}>
                <Button
                    title='Iniciar Chat'
                    variant='clay'
                    onPress={handleStartChat}
                    style={styles.button}
                />
                <Button
                    title='Conheça mais sobre o app'
                    variant='secondary'
                    onPress={handleAbout}
                    style={styles.button}
                />
                <Button
                    title='Sair'
                    variant='secondary'
                    onPress={handleLogout}
                    style={styles.button}
                />
            </View>
        </View>
    );
}

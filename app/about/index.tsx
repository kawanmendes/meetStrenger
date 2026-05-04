import { Text, View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme, Button, Card } from '../../design-system';
import { useRouter } from 'expo-router';
import React from 'react';

export default function About() {
    const router = useRouter();
    const { colors, spacing } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
        },
        backButton: {
            marginBottom: spacing.lg,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: spacing.md,
        },
        content: {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
            gap: spacing.lg,
        },
        section: {
            marginBottom: spacing.lg,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.primary,
            marginBottom: spacing.sm,
        },
        sectionText: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 22,
        },
        footer: {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            gap: spacing.sm,
        },
        footerText: {
            fontSize: 12,
            color: colors.textTertiary,
            textAlign: 'center',
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button 
                    title="← Voltar" 
                    onPress={() => router.back()}
                    variant="secondary"
                    style={styles.backButton}
                />
                <Text style={styles.title}>Sobre o MeetStranger</Text>
            </View>

            <ScrollView style={styles.content}>
                <Card variant='clay' padding='lg' style={styles.section}>
                    <Text style={styles.sectionTitle}>O que é o MeetStranger?</Text>
                    <Text style={styles.sectionText}>
                        O MeetStranger é uma plataforma de encontros online que conecta pessoas de todo o mundo. Nosso objetivo é proporcionar uma experiência única e segura para nossos usuários, permitindo que eles conheçam novas pessoas, façam amizades e, quem sabe, encontrem o amor.
                    </Text>
                </Card>

                <Card variant='clay' padding='lg' style={styles.section}>
                    <Text style={styles.sectionTitle}>🔒 Privacidade</Text>
                    <Text style={styles.sectionText}>
                        O MeetStranger leva a privacidade de seus usuários muito a sério. Implementamos medidas rigorosas para proteger as informações pessoais e garantir que nossos usuários possam desfrutar de uma experiência segura e confiável.
                    </Text>
                </Card>

                <Card variant='clay' padding='lg' style={styles.section}>
                    <Text style={styles.sectionTitle}>⚙️ Como Funciona</Text>
                    <Text style={styles.sectionText}>
                        O MeetStranger utiliza um algoritmo de correspondência avançado para conectar usuários com base em seus interesses, preferências e localização. Os usuários podem criar perfis detalhados, enviar mensagens e participar de salas de bate-papo.
                    </Text>
                </Card>

                <Card variant='clay' padding='lg' style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ Recursos</Text>
                    <Text style={styles.sectionText}>
                        O MeetStranger oferece uma variedade de recursos para tornar a experiência de nossos usuários mais envolvente e divertida. Desde salas de bate-papo temáticas até jogos interativos.
                    </Text>
                </Card>

                <Card variant='clay' padding='lg' style={styles.section}>
                    <Text style={styles.sectionTitle}>👨‍💻 Sobre o Desenvolvimento</Text>
                    <Text style={styles.sectionText}>
                        O MeetStranger foi desenvolvido com React Native + Expo, inspirado em projetos como Omegle e WhatsApp, com foco em segurança e experiência do usuário.
                    </Text>
                </Card>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Versão 1.0.0</Text>
                    <Text style={styles.footerText}>© 2026 - Desenvolvido com ❤️ para conectar pessoas</Text>
                    <Text style={styles.footerText}>Inspirado em Omegle e WhatsApp</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
// Importa componentes básicos do React Native para montar a interface
import { Text, View, Pressable, StyleSheet, SafeAreaView, Platform } from 'react-native';

// Importa o sistema de navegação baseado em rotas do Expo Router
import { Link } from 'expo-router';

// Importa biblioteca de ícones (FontAwesome)
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Importa tema do design system
import { useTheme } from '../design-system';
import { clayMedium } from '../design-system/tokens/shadows';

// Componente principal da tela Home
export default function WelcomeScreen() {
    const { colors, spacing, radius } = useTheme();

    // Apply shadows only on native platforms
    const shadowStyle = Platform.OS !== 'web' ? clayMedium : {};

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'space-between',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.md,
            gap: spacing.md,
        },
        button: {
            flex: 1,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.md,
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 60,
            borderWidth: 1,
            borderColor: colors.border,
        },
        highlightButton: {
            backgroundColor: colors.primary,
        },
        buttonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textPrimary,
            textAlign: 'center',
        },
        highlightButtonText: {
            color: colors.background,
            fontSize: 16,
        },
        buttonIcon: {
            position: 'absolute',
            right: spacing.lg,
        },
        highlightIcon: {
            color: colors.background,
        },
        spacer: {
            flex: 1,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* TOPO DA TELA */}
            <View style={styles.row}>

                {/* Botão LOGIN com navegação */}
                <Link href="/auth/login" asChild>
                    <Pressable style={[styles.button, shadowStyle]}>
                        <Text style={styles.buttonText}>🔐 LOGIN</Text>
                    </Pressable>
                </Link>

                {/* Botão REGISTER com destaque */}
                <Link href="/auth/register" asChild>
                    <Pressable style={[styles.button, styles.highlightButton, shadowStyle]}>
                        <Text style={[styles.buttonText, styles.highlightButtonText]}>
                            REGISTRAR
                        </Text>
                        <FontAwesome
                            name="user-plus"
                            size={16}
                            style={[styles.buttonIcon, styles.highlightIcon]}
                        />
                    </Pressable>
                </Link>

                {/* Botão SELECT */}
                <Link href="/chat/select" asChild>
                    <Pressable style={[styles.button, shadowStyle]}>
                        <Text style={styles.buttonText}>💬 CHAT</Text>
                    </Pressable>
                </Link>
            </View>

            {/* ESPAÇO FLEXÍVEL */}
            <View style={styles.spacer} />

            {/* BASE DA TELA */}
            <View style={styles.row}>

                {/* Botão ABOUT */}
                <Link href="/about" asChild>
                    <Pressable style={[styles.button, shadowStyle]}>
                        <Text style={styles.buttonText}>ℹ️ SOBRE</Text>
                    </Pressable>
                </Link>

                {/* Botão ROOM */}
                <Link href="/chat/room" asChild>
                    <Pressable style={[styles.button, shadowStyle]}>
                        <Text style={styles.buttonText}>🏠 ROOM</Text>
                    </Pressable>
                </Link>

                {/* Botão HOME */}
                <Link href="/home" asChild>
                    <Pressable style={[styles.button, shadowStyle]}>
                        <Text style={styles.buttonText}>🏡 HOME</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
}
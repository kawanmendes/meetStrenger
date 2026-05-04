import { Text, View, StyleSheet, SafeAreaView } from 'react-native'; 
import { useTheme, Button } from '../../design-system';
import { useRouter } from 'expo-router';

export default function Room() {
    const router = useRouter();
    const { colors, spacing } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: spacing.xs,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
        },
        placeholder: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: spacing.lg,
            textAlign: 'center',
        },
        footer: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chat Room</Text>
                <Text style={styles.subtitle}>Conectando com pessoas...</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.placeholder}>Chat em desenvolvimento</Text>
            </View>

            <View style={styles.footer}>
                <Button 
                    title="← Voltar" 
                    onPress={() => router.back()} 
                    variant="secondary"
                />
            </View>
        </SafeAreaView>
    );
}
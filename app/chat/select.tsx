import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'; 
import React from 'react';
import { Button, Card, useTheme } from '../../design-system';
import { clayMedium } from '../../design-system/tokens/shadows';
import { useRouter } from 'expo-router';

interface ChatCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
}

const category: ChatCategory[] = [
    {
        id: "movies",
        name: "Movies",
        description: "Chat de filmes",
        icon: "🎬"
    },
    {
        id: "gaming",
        name: "Gaming",
        description: "Chat de jogos",
        icon: "🎮"
    },
    {
        id: 'series',
        name: "Series",
        description: "Chat de séries",
        icon: "📺"
    }
];

export default function Select() { 
    const router = useRouter();
    const { colors, spacing, radius } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingTop: spacing['4xl'],
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: spacing.sm,
        },
        headerSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        content: {
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
        },
        categoryCard: {
            marginBottom: spacing.md,
        },
        categoryButton: {
            backgroundColor: colors.surface,
            ...clayMedium,
            borderRadius: radius.lg,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
        },
        categoryIcon: {
            fontSize: 32,
        },
        categoryInfo: {
            flex: 1,
        },
        categoryName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.primary,
            marginBottom: spacing.xs,
        },
        categoryDescription: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        footer: {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
        },
    });

    const handleCategorySelect = (categoryId: string) => {
        router.push(`/chat/room?category=${categoryId}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Selecione uma categoria de chat</Text>
                <Text style={styles.headerSubtitle}>Clique nos tópicos abaixo</Text>
            </View>

            <ScrollView style={styles.content}>
                {category.map((cat) => (
                    <Card key={cat.id} variant='clay' style={styles.categoryCard}>
                        <TouchableOpacity 
                            style={styles.categoryButton}
                            onPress={() => handleCategorySelect(cat.id)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryName}>{cat.name}</Text>
                                <Text style={styles.categoryDescription}>{cat.description}</Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Button 
                    title="← Voltar" 
                    onPress={() => router.back()} 
                    variant="secondary"
                />
            </View>
        </View>
    );
}
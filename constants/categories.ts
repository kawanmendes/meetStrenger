export const CATEGORIES = [
    {
        id: 'movies',
        name: 'Filmes',
        description:
            'Cenas, favoritos e recomendações.',
        icon: '🎬',
    },
    {
        id: 'gaming',
        name: 'Games',
        description:
            'Partidas, ranks e próximos lançamentos.',
        icon: '🎮',
    },
    {
        id: 'music',
        name: 'Música',
        description:
            'Playlists, artistas e shows.',
        icon: '🎵',
    },
    {
        id: 'study',
        name: 'Estudos',
        description:
            'Conteúdo, dicas e materiais de estudo.',
        icon: '📚',
    },
] as const;

export const VALID_CATEGORY_IDS =
    CATEGORIES.map(
        (c) => c.id
    );
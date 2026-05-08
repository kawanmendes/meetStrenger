import React, {
  useMemo
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useRouter
} from 'expo-router';

import {
  AnimalAvatar,
  GradientBackground,
  PillButton,
  useTheme
} from '../../design-system';

import {
  useAuth
} from '../../hooks/useAuth';

import {
  appImages
} from '../../constants/assets';

// ✅ IMPORTAR CATEGORIAS CENTRALIZADAS
import {
  CATEGORIES
} from '../../constants/categories';

export default function Home() {

  const router = useRouter();

  const theme = useTheme();

  const {
    user,
    logout
  } = useAuth();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingTop:
            theme.spacing['4xl'],
          paddingHorizontal:
            theme.spacing.lg,
        },

        topBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:
            'space-between',
          marginBottom:
            theme.spacing['2xl'],
        },

        greeting: {
          flex: 1,
          marginLeft:
            theme.spacing.md,
        },

        hello: {
          color:
            theme.colors
              .textSecondary,
          fontSize: 13,
          fontWeight: '800',
        },

        name: {
          color:
            theme.colors
              .textPrimary,
          fontSize: 22,
          lineHeight: 27,
          fontWeight: '900',
        },

        profile: {
          width: 44,
          height: 44,
          borderRadius:
            theme.radius.full,
          alignItems: 'center',
          justifyContent:
            'center',
          backgroundColor:
            'rgba(255,255,255,0.84)',
        },

        profileText: {
          color:
            theme.colors
              .primaryDark,
          fontWeight: '900',
          fontSize: 18,
        },

        title: {
          color:
            theme.colors
              .textPrimary,
          fontSize: 30,
          lineHeight: 36,
          fontWeight: '900',
          marginBottom:
            theme.spacing.sm,
        },

        subtitle: {
          color:
            theme.colors
              .textSecondary,
          fontSize: 15,
          fontWeight: '700',
          lineHeight: 22,
          marginBottom:
            theme.spacing.xl,
        },

        list: {
          paddingBottom:
            theme.spacing['4xl'],
          gap: theme.spacing.md,
        },

        card: {
          minHeight: 112,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          padding:
            theme.spacing.lg,
          borderRadius:
            theme.radius['2xl'],
          borderWidth: 1,
          borderColor:
            theme.colors.border,
          backgroundColor:
            'rgba(255,255,255,0.82)',
        },

        cardText: {
          flex: 1,
        },

        categoryName: {
          color:
            theme.colors
              .textPrimary,
          fontSize: 18,
          fontWeight: '900',
          marginBottom:
            theme.spacing.xs,
        },

        categoryDescription: {
          color:
            theme.colors
              .textSecondary,
          fontSize: 13,
          fontWeight: '700',
          lineHeight: 18,
        },

        footer: {
          gap: theme.spacing.md,
          paddingBottom:
            theme.spacing.lg,
        },
      }),
    [theme]
  );

  const openCategory = (
    categoryId: string
  ) => {

    router.push(
      `/chat/room?category=${categoryId}`
    );
  };

  return (
    <GradientBackground variant="vivid">
      <View style={styles.container}>

        <View style={styles.topBar}>

          <AnimalAvatar
            size={56}
            source={
              appImages.mascot
            }
          />

          <View
            style={
              styles.greeting
            }
          >

            <Text
              style={
                styles.hello
              }
            >
              Ola,
            </Text>

            <Text
              style={
                styles.name
              }
            >
              {user?.username ||
                'Stranger'}
            </Text>

          </View>

          <Pressable
            style={
              styles.profile
            }
            onPress={() =>
              router.push(
                '/profile'
              )
            }
          >

            <Text
              style={
                styles.profileText
              }
            >
              P
            </Text>

          </Pressable>
        </View>

        <Text style={styles.title}>
          Escolha uma categoria
        </Text>

        <Text
          style={styles.subtitle}
        >
          A home agora leva direto
          ao que importa:
          encontrar alguem com
          assunto em comum.
        </Text>

        <ScrollView
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
        >

          {/* ✅ USANDO CATEGORIES */}
          {CATEGORIES.map(
            (category) => (

              <Pressable
                key={category.id}
                style={
                  styles.card
                }
                onPress={() =>
                  openCategory(
                    category.id
                  )
                }
              >

                <AnimalAvatar
                  size={58}
                  animal={
                    category.icon
                  }
                />

                <View
                  style={
                    styles.cardText
                  }
                >

                  <Text
                    style={
                      styles.categoryName
                    }
                  >
                    {category.name}
                  </Text>

                  <Text
                    style={
                      styles.categoryDescription
                    }
                  >
                    {
                      category.description
                    }
                  </Text>

                </View>
              </Pressable>
            )
          )}
        </ScrollView>

        <View style={styles.footer}>

          <PillButton
            title="Loja de avatares"
            onPress={() =>
              router.push(
                '/profile/avatar-shop'
              )
            }
          />

          <PillButton
            title="Sair"
            variant="ghost"
            onPress={logout}
          />

        </View>
      </View>
    </GradientBackground>
  );
}
import { Text, View, Pressable, StyleSheet, SafeAreaView } from 'react-native'
import { Link } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useTheme } from '../design-system'
import { clayMedium, getShadow } from '../design-system/tokens/shadows'

export default function WelcomeScreen() {
  const { colors, spacing, radius } = useTheme()

  const shadowStyle = getShadow(clayMedium)

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
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Link href="/auth/login" asChild>
          <Pressable style={{ ...styles.button, ...shadowStyle }}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>
        </Link>

        <Link href="/auth/register" asChild>
          <Pressable style={{ ...styles.button, ...styles.highlightButton, ...shadowStyle }}>
            <Text style={{ ...styles.buttonText, ...styles.highlightButtonText }}>
              REGISTRAR
            </Text>
            <FontAwesome
              name="user-plus"
              size={16}
              style={{ ...styles.buttonIcon, ...styles.highlightIcon }}
            />
          </Pressable>
        </Link>

        <Link href="/chat/select" asChild>
          <Pressable style={{ ...styles.button, ...shadowStyle }}>
            <Text style={styles.buttonText}> CHAT</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.spacer} />

      <View style={styles.row}>
        <Link href="/about" asChild>
          <Pressable style={{ ...styles.button, ...shadowStyle }}>
            <Text style={styles.buttonText}>ℹSOBRE</Text>
          </Pressable>
        </Link>

        <Link href="/chat/room" asChild>
          <Pressable style={{ ...styles.button, ...shadowStyle }}>
            <Text style={styles.buttonText}> ROOM</Text>
          </Pressable>
        </Link>

        <Link href="/home" asChild>
          <Pressable style={{ ...styles.button, ...shadowStyle }}>
            <Text style={styles.buttonText}> HOME</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  )
}
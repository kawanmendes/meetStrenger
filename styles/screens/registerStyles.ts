import { StyleSheet } from "react-native";
import { Colors as colors } from "../../design-system/tokens/colors";
import { Shadows, Spacing } from "../../design-system/tokens/spacing";
import { TextStyles } from "../../design-system/tokens/typography";

export const registerStyles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing['4xl'],
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: Spacing.xl,
        ...Shadows.lg,
        shadowColor: colors.shadow,
    },
    title:{
        ...TextStyles.title,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: Spacing.sm,
        letterSpacing: -0.2,
        lineHeight: 26,
        textAlign: 'center',
    },
    subtitle: {
        ...TextStyles.body,
        color: colors.textSecondary,
        marginBottom: Spacing['4xl'],
        lineHeight: 22,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
    },
    registerButton: {
        marginBottom: Spacing.sm,
        marginTop: Spacing.xl,
    },
})
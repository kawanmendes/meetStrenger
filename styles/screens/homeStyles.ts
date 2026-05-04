import {StyleSheet} from "react-native";
import { Colors as colors } from "../../design-system/tokens/colors";
import { BorderRadius, Shadows, Spacing } from "../../design-system";
import { TextStyles } from "../../design-system/tokens/typography";

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: Spacing.xl,
    },
    header :{
        paddingTop: Spacing['4xl'],
        paddingBottom: Spacing.xl,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: Spacing.xl,
        shadowRadius: 20,
        shadowColor: colors.shadow,
        margin : "auto",
    },
    welcome : {
        ...TextStyles.title,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: Spacing.sm,
        letterSpacing: -0.1,
        lineHeight: 24,
    },
    subTitle : {
        ...TextStyles.caption,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    content : {
        flex: 1,
    },
    card : {
        backgroundColor: colors.surface,
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xl,
    },
    cardTitle : {
        ...TextStyles.title,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: Spacing.md,
        letterSpacing: -0.2,
    },
    cardDescription : {
        ...TextStyles.caption,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    feature :{
        alignItems : 'center',
    },
    featureIcon : {
        fontSize: 28,
        marginBottom: Spacing.xs,
    },
    featureText : {
        ...TextStyles.small,
        color: colors.primary,
        fontWeight: '500',
    },
    Buttons : {
        paddingBottom: Spacing['4xl'],
    },
    Button : {
        marginBottom: Spacing.sm,
    },
});
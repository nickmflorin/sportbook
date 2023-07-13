import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

/**
 * Defines the various base types, or forms, that a given button and/or anchor can exist in.
 *
 * In regard to buttons and/or anchors, the term "type" is used to describe a specific set of styling behavior that
 * is unique to the buttons and/or anchors that are described with that "type".  Each button "type" is further broken
 * down into "variants".
 */
export const ButtonTypes = enumeratedLiterals(["solid", "alternate", "action"] as const);
export type ButtonType = EnumeratedLiteralType<typeof ButtonTypes>;

export const ButtonSizes = enumeratedLiterals(["xs", "sm", "md", "lg"] as const);
export type ButtonSize = EnumeratedLiteralType<typeof ButtonSizes>;

export const ButtonActionVariants = enumeratedLiterals(["primary", "secondary", "bare"] as const);
export type ButtonActionVariant = EnumeratedLiteralType<typeof ButtonActionVariants>;

export const ButtonSolidVariants = enumeratedLiterals(["primary", "secondary", "bare", "danger", "white"] as const);
export type ButtonSolidVariant = EnumeratedLiteralType<typeof ButtonSolidVariants>;

export const ButtonAlternateVariants = enumeratedLiterals(["link", "danger"] as const);
export type ButtonAlternateVariant = EnumeratedLiteralType<typeof ButtonAlternateVariants>;

export const ButtonCornerStyles = enumeratedLiterals(["rounded", "square", "normal"] as const);
export type ButtonCornerStyle = EnumeratedLiteralType<typeof ButtonCornerStyles>;

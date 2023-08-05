import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const ButtonTypes = enumeratedLiterals(["solid", "alternate", "action"] as const);
export type ButtonType = EnumeratedLiteralType<typeof ButtonTypes>;

export const ButtonSizes = enumeratedLiterals(["xs", "sm", "md", "lg"] as const);
export type ButtonSize = EnumeratedLiteralType<typeof ButtonSizes>;

export const ButtonVariants = enumeratedLiterals(["primary", "secondary", "bare", "danger", "outline"] as const);
export type ButtonVariant = EnumeratedLiteralType<typeof ButtonVariants>;

export const ButtonCornerStyles = enumeratedLiterals(["rounded", "square", "normal"] as const);
export type ButtonCornerStyle = EnumeratedLiteralType<typeof ButtonCornerStyles>;

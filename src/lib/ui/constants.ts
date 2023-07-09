import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const SizeAxes = enumeratedLiterals(["horizontal", "vertical"] as const);

/**
 * Represents the various x-y axes that the props for a component can dictate when specifying how the component should
 * size.  Each {@link SizeAxis} corresponds to a specific {@link SizeDimension}, and can be used to specify the
 * {@link SizeDimension} that should be used for a given size specification.
 */
export type SizeAxis = EnumeratedLiteralType<typeof SizeAxes>;

export const CSSDirections = enumeratedLiterals(["up", "down", "left", "right"] as const);
export type CSSDirection = EnumeratedLiteralType<typeof CSSDirections>;

export const SizeContains = enumeratedLiterals(["fit", "square"] as const);
export type SizeContain = EnumeratedLiteralType<typeof SizeContains>;

export const SpinnerSizes = enumeratedLiterals(["small", "medium", "large", "fill"] as const);
export type SpinnerSize = EnumeratedLiteralType<typeof SpinnerSizes>;

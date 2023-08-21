import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const TypographySizes = enumeratedLiterals(["xxxs", "xxs", "xs", "sm", "md", "lg", "xl"] as const);
export type TypographySize = EnumeratedLiteralType<typeof TypographySizes>;

export const FontWeights = enumeratedLiterals(["light", "regular", "medium", "semibold", "bold"] as const);
export type FontWeight = EnumeratedLiteralType<typeof FontWeights>;

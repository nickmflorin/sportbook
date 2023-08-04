import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

export const InputSizes = enumeratedLiterals(["xs", "sm", "md", "lg"] as const);
export type InputSize = EnumeratedLiteralType<typeof InputSizes>;

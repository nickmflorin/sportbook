import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const FieldConditions = enumeratedLiterals(["required", "optional"] as const);
export type FieldCondition = EnumeratedLiteralType<typeof FieldConditions>;

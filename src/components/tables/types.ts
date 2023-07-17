import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

export const DataTableSizes = enumeratedLiterals(["sm", "md", "lg"] as const);
export type DataTableSize = EnumeratedLiteralType<typeof DataTableSizes>;

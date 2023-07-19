import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const ApplicationErrorCodes = enumeratedLiterals(["not-authenticated", "forbidden"] as const);
export type ApplicationErrorCode = EnumeratedLiteralType<typeof ApplicationErrorCodes>;

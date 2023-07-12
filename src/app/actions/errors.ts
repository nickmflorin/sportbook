import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

export const ActionErrorCodes = enumeratedLiterals(["NOT_AUTHENTICATED"] as const);
export type ActionErrorCode = EnumeratedLiteralType<typeof ActionErrorCodes>;

export class ActionError extends Error {
  public readonly code: ActionErrorCode;

  constructor({ message, code }: { message: string; code: ActionErrorCode }) {
    super(message);
    this.code = code;
  }
}

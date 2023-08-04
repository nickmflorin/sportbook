import { z } from "zod";

import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

export const ServerErrorCodes = enumeratedLiterals(["NOT_AUTHENTICATED", "BAD_REQUEST", "FORBIDDEN"] as const);
export type ServerErrorCode = EnumeratedLiteralType<typeof ServerErrorCodes>;

export enum ErrorStatusCode {
  HTTP_401_NOT_AUTHORIZED = 401,
  HTTP_403_FORBIDDEN = 403,
  HTTP_400_BAD_REQUEST = 400,
}

const DEFAULT_ACTION_ERROR_MESSAGES: { [key in ServerErrorCode]: string } = {
  NOT_AUTHENTICATED: "You must be authenticated to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  BAD_REQUEST: "Bad request.",
};

const DEFAULT_ACTION_STATUS_CODES: { [key in ServerErrorCode]: number } = {
  NOT_AUTHENTICATED: ErrorStatusCode.HTTP_401_NOT_AUTHORIZED,
  FORBIDDEN: ErrorStatusCode.HTTP_403_FORBIDDEN,
  BAD_REQUEST: ErrorStatusCode.HTTP_400_BAD_REQUEST,
};

const ServerErrorResponseSchema = z.object({
  code: z.enum(ServerErrorCodes.__ALL__),
  statusCode: z.nativeEnum(ErrorStatusCode),
  message: z.string(),
});

export const isServerErrorResponse = (response: unknown): response is ServerErrorResponse =>
  ServerErrorResponseSchema.safeParse(response).success;

export type ServerErrorResponse = {
  readonly code: ServerErrorCode;
  readonly statusCode: ErrorStatusCode;
  readonly message: string;
};

type ServerErrorConfig = {
  readonly code: ServerErrorCode;
  readonly statusCode?: ErrorStatusCode;
  readonly message?: string;
};

export class ServerError extends Error {
  public readonly code: ServerErrorCode;
  public readonly statusCode: ErrorStatusCode;

  constructor(config: ServerErrorCode | ServerErrorConfig) {
    const msg = typeof config === "string" ? DEFAULT_ACTION_ERROR_MESSAGES[config] : config.message;
    super(msg);
    this.code = typeof config === "string" ? config : config.code;
    this.statusCode =
      typeof config !== "string"
        ? config.statusCode || DEFAULT_ACTION_STATUS_CODES[this.code]
        : DEFAULT_ACTION_STATUS_CODES[this.code];
  }

  public static BadRequest = (message?: string) => new ServerError({ code: ServerErrorCodes.BAD_REQUEST, message });

  public static NotAuthenticated = (message?: string) =>
    new ServerError({ code: ServerErrorCodes.NOT_AUTHENTICATED, message });

  public static Forbidden = (message?: string) => new ServerError({ code: ServerErrorCodes.FORBIDDEN, message });

  public toResponse = (): ServerErrorResponse => ({
    code: this.code,
    statusCode: this.statusCode,
    message: this.message,
  });
}

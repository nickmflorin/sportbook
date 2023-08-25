import { z } from "zod";
import { NextResponse } from "next/server";

import superjson from "superjson";
import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

export const ServerErrorCodes = enumeratedLiterals(["NOT_AUTHENTICATED", "BAD_REQUEST", "FORBIDDEN"] as const);
export type ServerErrorCode = EnumeratedLiteralType<typeof ServerErrorCodes>;

export enum SuccessStatusCode {
  HTTP_200_OK = 200,
}

export enum ErrorStatusCode {
  HTTP_401_NOT_AUTHORIZED = 401,
  HTTP_403_FORBIDDEN = 403,
  HTTP_400_BAD_REQUEST = 400,
}

const DEFAULT_ERROR_MESSAGES: { [key in ServerErrorCode]: string } = {
  NOT_AUTHENTICATED: "You must be authenticated to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  BAD_REQUEST: "Bad request.",
};

const DEFAULT_ERROR_STATUS_CODES: { [key in ServerErrorCode]: number } = {
  NOT_AUTHENTICATED: ErrorStatusCode.HTTP_401_NOT_AUTHORIZED,
  FORBIDDEN: ErrorStatusCode.HTTP_403_FORBIDDEN,
  BAD_REQUEST: ErrorStatusCode.HTTP_400_BAD_REQUEST,
};

const ServerErrorResponseBodySchema = z.object({
  code: z.enum(ServerErrorCodes.__ALL__),
  statusCode: z.nativeEnum(ErrorStatusCode),
  message: z.string(),
});

export const isServerErrorResponseBody = (response: unknown): response is ServerErrorResponseBody =>
  ServerErrorResponseBodySchema.safeParse(response).success;

export type ServerErrorResponseBody = {
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
    let code = typeof config === "string" ? config : config.code;
    let msg: string;
    if (typeof config === "string") {
      msg = DEFAULT_ERROR_MESSAGES[config];
    } else {
      msg =
        typeof config.message === "undefined" || config.message.length === 0
          ? DEFAULT_ERROR_MESSAGES[config.code]
          : config.message;
    }
    super(msg);
    this.code = code;
    this.statusCode =
      typeof config !== "string"
        ? config.statusCode || DEFAULT_ERROR_STATUS_CODES[this.code]
        : DEFAULT_ERROR_STATUS_CODES[this.code];
  }

  public static BadRequest = (message?: string) => new ServerError({ code: ServerErrorCodes.BAD_REQUEST, message });

  public static NotAuthenticated = (message?: string) =>
    new ServerError({ code: ServerErrorCodes.NOT_AUTHENTICATED, message });

  public static Forbidden = (message?: string) => new ServerError({ code: ServerErrorCodes.FORBIDDEN, message });

  public toJson = (): ServerErrorResponseBody => ({
    code: this.code,
    statusCode: this.statusCode,
    message: this.message,
  });

  public toSerializedJson = () => superjson.serialize(this.toJson());

  public toResponse = () => {
    return NextResponse.json(this.toSerializedJson(), { status: this.statusCode });
  };
}

type ServerSuccessConfig<T> = {
  readonly data: T;
  readonly statusCode?: SuccessStatusCode;
};

export type ServerSuccessResponseBody<T> = { data: T };

export class ServerSuccess<T> {
  private readonly data: T;
  private readonly statusCode: SuccessStatusCode;

  constructor({ data, statusCode }: ServerSuccessConfig<T>) {
    this.data = data;
    this.statusCode = statusCode || SuccessStatusCode.HTTP_200_OK;
  }

  public toJson = (): ServerSuccessResponseBody<T> => {
    return { data: this.data };
  };

  public toSerializedJson = () => ({ data: superjson.serialize(this.data) });

  public toResponse = () => {
    return NextResponse.json(this.toSerializedJson(), { status: this.statusCode });
  };

  public static OK = <T>(data: T) => new ServerSuccess<T>({ data, statusCode: SuccessStatusCode.HTTP_200_OK });
}

export type ServerResponseConfig<T> = ServerErrorCode | ServerErrorConfig | ServerSuccessConfig<T>;

export type ServerResponseBody<T> = ServerSuccessResponseBody<T> | ServerErrorResponseBody;

const isErrorConfig = <T>(config: ServerResponseConfig<T>): config is ServerErrorCode | ServerErrorConfig =>
  typeof config === "string" || (config as ServerErrorConfig).code !== undefined;

type ServerResponseRT<T, C extends ServerResponseConfig<T>> = C extends ServerErrorCode | ServerErrorConfig
  ? ServerError
  : ServerSuccess<T>;

export const ServerResponse = <T, C extends ServerResponseConfig<T>>(config: C): ServerResponseRT<T, C> => {
  if (isErrorConfig(config)) {
    return new ServerError(config) as ServerResponseRT<T, C>;
  }
  return new ServerSuccess<T>(config) as ServerResponseRT<T, C>;
};

ServerResponse.OK = ServerSuccess.OK;
ServerResponse.BadRequest = ServerError.BadRequest;
ServerResponse.NotAuthenticated = ServerError.NotAuthenticated;
ServerResponse.Forbidden = ServerError.Forbidden;

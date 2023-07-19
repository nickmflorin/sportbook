import { NextResponse } from "next/server";

import superjson from "superjson";

export * from "./hooks";
export * from "./types";

export enum StatusCode {
  HTTP_200_OK = 200,
  HTTP_401_NOT_AUTHORIZED = 401,
}

export const AppResponse = {
  OK: <T>(data: T) => NextResponse.json({ data: superjson.serialize(data) }, { status: StatusCode.HTTP_200_OK }),
  NOT_AUTHORIZED: (error = "The user is not authenticated.") =>
    NextResponse.json({ error }, { status: StatusCode.HTTP_401_NOT_AUTHORIZED }),
};

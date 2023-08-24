import "server-only";

import { env } from "~/env.mjs";

type DBNumericParam = "port";

type DBParam = DBNumericParam | "name" | "host" | "password" | "user";

export type DatabaseParams<V extends string | undefined = string | undefined> = {
  [key in DBParam]: key extends DBNumericParam ? V | number : V;
};

type IsDatabaseParamsAssertion = (params: DatabaseParams) => asserts params is DatabaseParams<string>;

const assertIsDatabaseParams: IsDatabaseParamsAssertion = (params: DatabaseParams) => {
  const invalid = Object.keys(params).filter((k: string) => params[k as DBParam] === undefined);
  if (invalid.length !== 0) {
    throw new Error(`Configuration Error: Database parameters ${invalid.join(", ")} not defined!`);
  }
};

export const postgresConnectionString = (params: DatabaseParams): string => {
  assertIsDatabaseParams(params);
  return `postgresql://${params.user}:${params.password}` + `@${params.host}:${params.port}/${params.name}`;
};

type GetDatabaseUrlParams = DatabaseParams & { readonly url?: string };

export const getDatabaseUrl = (params?: GetDatabaseUrlParams): string => {
  if (!params) {
    if (env.DATABASE_URL) {
      return env.DATABASE_URL;
    }
    return postgresConnectionString({
      password: env.DATABASE_PASSWORD,
      user: env.DATABASE_USER,
      port: env.DATABASE_PORT,
      host: env.DATABASE_HOST,
      name: env.DATABASE_NAME,
    });
  } else if (params.url) {
    return params.url;
  }
  return postgresConnectionString(params);
};

/*
This file should *only* be used for instantiating the PrismaClient.

Each instance of PrismaClient manages a connection pool, which means that a large number of clients can exhaust the
database connection limit. This applies to all database connectors.  As such, each application should generally only
need one instance of the PrismaClient.

See: https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient
     /instantiate-prisma-client#the-number-of-prismaclient-instances-matters

NextJS supports hot reloading of changed files, which means that the module responsible for exporting the PrismaClient
will be refreshed constantly.  This can result in additional, unwanted instances of PrismaClient in a development
environment.

As a workaround, you can store PrismaClient as a global variable in development environments only, as global variables
are not reloaded:

See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
     #prevent-hot-reloading-from-creating-new-instances-of-prismaclient
*/
import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

import { ModelTypeExtension, userModelExtension } from "./extensions";
import { postgresConnectionString } from "./util";

type DBNumericParam = "DATABASE_PORT";

type DBParam = DBNumericParam | "DATABASE_NAME" | "DATABASE_HOST" | "DATABASE_PASSWORD" | "DATABASE_USER";

type DatabaseParams<V extends string | undefined = string | undefined> = {
  [key in DBParam]: key extends DBNumericParam ? V | number : V;
};

type IsDatabaseParamsAssertion = (params: DatabaseParams) => asserts params is DatabaseParams<string>;

const assertIsDatabaseParams: IsDatabaseParamsAssertion = (params: DatabaseParams) => {
  const invalid = Object.keys(params).filter((k: string) => params[k as DBParam] === undefined);
  if (invalid.length !== 0) {
    throw new Error(`Configuration Error: Database parameters ${invalid.join(", ")} not defined!`);
  }
};

/**
 * Initializes and returns the {@link PrismaClient} based on configuration values stored as ENV variables.
 *
 * @returns {PrismaClient}
 */
export const initializePrismaClient = () => {
  let url: string;
  if (env.DATABASE_URL) {
    url = env.DATABASE_URL;
  } else {
    const PARAMS: DatabaseParams = {
      DATABASE_PASSWORD: env.DATABASE_PASSWORD,
      DATABASE_USER: env.DATABASE_USER,
      DATABASE_PORT: env.DATABASE_PORT,
      DATABASE_HOST: env.DATABASE_HOST,
      DATABASE_NAME: env.DATABASE_NAME,
    };

    /* Ensure that all of the parameters required to create the connection URL string are defined. */
    assertIsDatabaseParams(PARAMS);

    url = postgresConnectionString({
      password: PARAMS.DATABASE_PASSWORD,
      user: PARAMS.DATABASE_USER,
      port: PARAMS.DATABASE_PORT,
      host: PARAMS.DATABASE_HOST,
      name: PARAMS.DATABASE_NAME,
    });
  }
  const prisma = new PrismaClient({
    log: env.DATABASE_LOG_LEVEL,
    datasources: { db: { url } },
  });

  return prisma.$extends({
    model: {
      user: userModelExtension(prisma),
    },
  });
};

export type ClientType = ReturnType<typeof initializePrismaClient>;

const globalPrisma = global as unknown as { prisma: ClientType };

export const prisma = globalPrisma.prisma || initializePrismaClient();

if (process.env.NODE_ENV === "development") {
  globalPrisma.prisma = prisma;
}

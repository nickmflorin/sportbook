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
import { PrismaClient as RootPrismaClient, FileUploadEntity, FileType } from "@prisma/client";

import { env } from "~/env.mjs";

import { userModelExtension } from "./extensions";
import { ModelMetaDataMiddleware } from "./middleware";
import { getDatabaseUrl, type DatabaseParams } from "./urls";

export * from "./errors";

/**
 * Initializes and returns both the extended and unextended forms of the {@link PrismaClient} based on configuration
 * values stored as ENV variables.
 *
 * @returns {{ xprisma: PrismaClientWithExtensions, prisma: PrismaClient }}
 */
export const initializePrismaClient = (params?: DatabaseParams) => {
  const url = getDatabaseUrl(params);
  const prisma = new RootPrismaClient({
    log: env.DATABASE_LOG_LEVEL,
    datasources: { db: { url } },
  });
  prisma.$use(ModelMetaDataMiddleware);
  return {
    prisma,
    xprisma: prisma.$extends({
      model: {
        user: userModelExtension(prisma),
      },
      result: {
        team: {
          getImage: {
            needs: { id: true },
            compute(team) {
              return async () => {
                const image = (
                  await prisma.fileUpload.findMany({
                    where: { entityId: team.id, entityType: FileUploadEntity.TEAM, fileType: FileType.IMAGE },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                  })
                )[0];
                return image === undefined ? null : image;
              };
            },
          },
        },
        league: {
          getImage: {
            needs: { id: true },
            compute(league) {
              return async () => {
                const image = (
                  await prisma.fileUpload.findMany({
                    where: { entityId: league.id, entityType: FileUploadEntity.LEAGUE, fileType: FileType.IMAGE },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                  })
                )[0];
                return image === undefined ? null : image;
              };
            },
          },
        },
        location: {
          getImage: {
            needs: { id: true },
            compute(location) {
              return async () => {
                const image = (
                  await prisma.fileUpload.findMany({
                    where: { entityId: location.id, entityType: FileUploadEntity.LOCATION, fileType: FileType.IMAGE },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                  })
                )[0];
                return image === undefined ? null : image;
              };
            },
          },
        },
      },
    }),
  };
};

export type PrismaClientWithExtensions = ReturnType<typeof initializePrismaClient>["xprisma"];
export type PrismaClient = ReturnType<typeof initializePrismaClient>["prisma"];

export let prisma: PrismaClient;
export let xprisma: PrismaClientWithExtensions;

const globalPrisma = global as unknown as { prisma: PrismaClient; xprisma: PrismaClientWithExtensions };

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    ({ prisma, xprisma } = initializePrismaClient());
  } else {
    if (!globalPrisma.prisma || !globalPrisma.xprisma) {
      const { prisma: _prisma, xprisma: _xprisma } = initializePrismaClient();
      globalPrisma.prisma = _prisma;
      globalPrisma.xprisma = _xprisma;
    }
    prisma = globalPrisma.prisma;
    xprisma = globalPrisma.xprisma;
  }
}

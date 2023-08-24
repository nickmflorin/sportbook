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
import "server-only";

import { PrismaClient as RootPrismaClient, type FileUploadEntity, FileType } from "@prisma/client";

import { logger } from "~/application/logger";
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
  logger.info("Initializing Prisma Client");
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
      client: {
        async $getImageUrl({ id, entity }: { id: string; entity: FileUploadEntity }) {
          const image = (
            await prisma.fileUpload.findMany({
              where: { entityId: id, entityType: entity, fileType: FileType.IMAGE },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { fileUrl: true },
            })
          )[0];
          return image === undefined ? null : image.fileUrl;
        },
        async $getImageUrls({ ids, entity }: { ids: string[]; entity: FileUploadEntity }) {
          const images = await prisma.fileUpload.groupBy({
            by: ["entityId", "fileUrl", "createdAt"],
            where: { entityId: { in: ids }, entityType: entity, fileType: FileType.IMAGE },
            orderBy: { createdAt: "desc" },
            take: 1,
          });
          return images.reduce(
            (prev, curr) => {
              if (prev[curr.entityId] !== undefined) {
                throw new Error(
                  "Prisma group by query unexpectedly returned multiple file uploads for the same entity ID!",
                );
              }
              return { ...prev, [curr.entityId]: curr.fileUrl };
            },
            {} as Record<string, string | null>,
          );
        },
      },
    }),
  };
};

export type PrismaClientWithExtensions = ReturnType<typeof initializePrismaClient>["xprisma"];
export type PrismaClient = ReturnType<typeof initializePrismaClient>["prisma"];

export let prisma: PrismaClient;
export let xprisma: PrismaClientWithExtensions;

const globalPrisma = globalThis as unknown as { prisma: PrismaClient };
const globalXPrisma = globalThis as unknown as { prisma: PrismaClientWithExtensions };

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    ({ prisma, xprisma } = initializePrismaClient());
  } else {
    if (!globalPrisma.prisma || !globalXPrisma.prisma) {
      ({ prisma, xprisma } = initializePrismaClient());
      logger.info("Storing Globally Instantiated Prisma Client");
      globalPrisma.prisma = prisma;
      globalXPrisma.prisma = xprisma;
    } else {
      prisma = globalPrisma.prisma;
      xprisma = globalXPrisma.prisma;
    }
  }
}

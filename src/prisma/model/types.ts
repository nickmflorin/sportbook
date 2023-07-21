import { type Prisma, type PrismaClient } from "@prisma/client";

export type Model = {
  readonly id: string;
};

/**
 * Returns the type associated with the Prisma model defined by the {@link Prisma.ModelName}, {@link M}.
 */
export type PrismaModelType<M extends Prisma.ModelName> = Lowercase<M> extends keyof PrismaClient
  ? Awaited<ReturnType<PrismaClient[Lowercase<M>]["findUniqueOrThrow"]>>
  : never;

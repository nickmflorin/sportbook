import { GetServerSidePropsContext } from "next";

import { getAuth } from "@clerk/nextjs/server";
import { type Org, type User } from "@prisma/client";
import { TRPCError, initTRPC, type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { logger } from "~/internal/logger";

type CreateContextOptions = { org: Org | null; user: User | null };

export const createInnerTRPCContext = (_opts: CreateContextOptions) => ({
  ..._opts,
  prisma,
});

export const createTRPCContext = async (_opts: CreateNextContextOptions | GetServerSidePropsContext) => {
  let user: User | null = null;
  let org: Org | null = null;

  const { userId: clerkUserId, orgId: clerkOrgId } = getAuth(_opts.req);
  // Currently, we are not enforcing that the user belongs to an organization.
  if (clerkOrgId) {
    org = await prisma.org.findUnique({ where: { clerkId: clerkOrgId } });
    // Do not upsert organizations, but log a warning and treat the user as not belonging to an organization.
    if (org === null) {
      logger.warn(`No organization exists in database for Clerk organization with ID '${clerkOrgId}'.`);
    }
  }
  if (clerkUserId) {
    /* When a user creates an account in the application, the user will be created in Clerk but a User model instance
       will not be created - so the user may be 'null'.  If the User model instance does not yet exist, it should be
       created.  This will only occur immediately after the user has registered. */
    user = await prisma.user.upsert({
      where: { clerkId: clerkUserId },
      update: {},
      create: { clerkId: clerkUserId },
    });
  }
  return createInnerTRPCContext({ org, user });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure
  .use(async ({ path, type, next }) => {
    if (env.HTTP_LOGGING === true) {
      const start = Date.now();
      const result = await next();
      const duration = `${String(Date.now() - start)}ms`;
      if (result.ok) {
        logger.info({ duration }, `[${type}] [${path}] Successful Request`);
      } else {
        logger.error({ duration, stack: result.error.stack }, `[${type}] [${path}] Failed Request`);
      }
      return result;
    }
    return next();
  })
  .use(
    t.middleware(({ next, ctx }) => {
      // Currently, we are not enforcing that the user belongs to an organization.
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return next({
        ctx: {
          org: ctx.org,
          user: ctx.user,
        },
      });
    }),
  );

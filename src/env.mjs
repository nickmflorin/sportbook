import { Prisma } from "@prisma/client";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * @typedef CommaSeparatedArraySchemaOptions<V>
 * @type {object}
 * @property {(v: string) => string} partTransformer - an ID.
 * @property {readonly V[]} options - your name.
 * @template {string} V
 */

/**
 * @typedef CreateCommaSeparatedArraySchema<V>
 * @type {<V extends string>(params: CommaSeparatedArraySchemaOptions<V>): z.ZodEffects<z.ZodString, V[], V>;}
 * @template {string} V
 */

/**
 * @type {CreateCommaSeparatedArraySchema}
 */
export const createCommaSeparatedArraySchema = params =>
  z
    .string()
    .transform((value, ctx) => {
      const parsed = value
        .split(",")
        .map(v => v.trim())
        .map(v => (params?.partTransformer ? params.partTransformer(v) : v));
      const invalid = parsed.filter(vi => !params.options.includes(vi));
      if (invalid.length !== 0) {
        invalid.map(inv => {
          ctx.addIssue({
            message: `The value '${inv}' is invalid. Must be one of ${params.options.join(",")}`,
            code: z.ZodIssueCode.invalid_enum_value,
            received: inv,
            options: [...params.options],
          });
        });
        return z.NEVER;
      }
      return /** @type {V[]} */ (parsed);
    })
    .optional();

/**
 * @type {z.ZodEffects<z.ZodString, Prisma.LogLevel[], Prisma.LogLevel>>}
 */
const PrismaLogLevelSchema = createCommaSeparatedArraySchema({
  options: ["info", "query", "warn", "error"],
  partTransformer: v => v.toLowerCase(),
});

/**
 * @type {z.ZodUnion<[
 *   z.ZodEffects<z.ZodType<true, z.ZodTypeDef, true>, boolean, true>,
 *   z.ZodEffects<z.ZodType<false, z.ZodTypeDef, false>, boolean, false>]
 * >}
 */
const StringBooleanFlagSchema = z.union([
  z.custom(val => typeof val === "string" && val.toLowerCase() === "true").transform(() => true),
  z.custom(val => typeof val === "string" && val.toLowerCase() === "false").transform(() => false),
]);

/**
 * @typedef {("warn" | "fatal" | "error" | "info" | "debug" | "trace" | "silent")} LogLevel
 * @type {Record<"test" | "development" | "production", LogLevel>}
 */
const DEFAULT_LOG_LEVELS = {
  development: "debug",
  production: "info",
  test: "debug",
};

/**
 * @type {Record<"test" | "development" | "production", boolean>}
 */
const DEFAULT_PRETTY_LOGGING = {
  development: true,
  production: false,
  test: true,
};

export const env = createEnv({
  /* ----------------------------------- Server Environment Variables ------------------------------------ */
  server: {
    APP_NAME_FORMAL: z.string(),
    DATABASE_URL: process.env.NODE_ENV === "test" ? z.literal("") : z.string().url().optional(),
    MIGRATE_DATABASE_URL: process.env.NODE_ENV === "test" ? z.literal("") : z.string().url(),
    DATABASE_NAME: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_USER: z.string().optional(),
    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: z.number().int().positive().optional(),
    DATABASE_LOG_LEVEL: PrismaLogLevelSchema.optional(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    PRETTY_LOGGING: StringBooleanFlagSchema.default(DEFAULT_PRETTY_LOGGING[process.env.NODE_ENV === "development"]),
    CLERK_SECRET_KEY:
      process.env.NODE_ENV === "test"
        ? z.literal("")
        : z.string().startsWith(process.env.NODE_ENV === "development" ? "sk_test" : "sk_live"),
  },
  /* ----------------------------------- Client Environment Variables ------------------------------------ */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NODE_ENV === "test"
        ? z.literal("")
        : z.string().startsWith(process.env.NODE_ENV === "development" ? "pk_test" : "pk_live"),
    NEXT_PUBLIC_LOG_LEVEL: z
      .union([
        z.literal("fatal"),
        z.literal("error"),
        z.literal("info"),
        z.literal("warn"),
        z.literal("debug"),
        z.literal("trace"),
        z.literal("silent"),
      ])
      .default(DEFAULT_LOG_LEVELS[process.env.NODE_ENV]),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  },
  runtimeEnv: {
    /* ----------------------------------- Server Environment Variables ------------------------------------ */
    DATABASE_URL: process.env.DATABASE_URL,
    MIGRATE_DATABASE_URL: process.env.MIGRATE_DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_LOG_LEVEL: process.env.DATABASE_LOG_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
    PRETTY_LOGGING: process.env.PRETTY_LOGGING,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    APP_NAME_FORMAL: process.env.APP_NAME_FORMAL,
    /* ----------------------------------- Client Environment Variables ------------------------------------ */
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

const d = env.MIGRATE_DATABASE_URL;

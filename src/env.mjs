import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const createCommaSeparatedArraySchema = () =>
  z.custom((value) => {
    if (typeof value === "string") {
      const parsed = value
        .split(",")
        .map((v) => v.trim())
        .map((v) => (params?.partTransformer ? params.partTransformer(v) : v));

      const invalid = parsed.map((vi) => !params.options.includes(vi));
      if (invalid.length === 1) {
        return {
          message: `The value '${
            invalid[0]
          }' is invalid, must be one of '${params.options.join(",")}'.`,
        };
      } else if (invalid.length !== 0) {
        return {
          message: `The values '${invalid.join(
            ","
          )}' are invalid, must be one of '${params.options.join(",")}'.`,
        };
      }
      return true;
    }
    // TODO: How do we allow this to be true depending on optionality?
    return true;
  });

const PrismaLogLevelSchema = createCommaSeparatedArraySchema({
  options: ["info", "query", "warn", "error"],
  partTransformer: (v) => v.toLowerCase(),
});

/**
 * @type {z.ZodUnion<[
 *   z.ZodEffects<z.ZodType<true, z.ZodTypeDef, true>, boolean, true>,
 *   z.ZodEffects<z.ZodType<false, z.ZodTypeDef, false>, boolean, false>]
 * >}
 */
const stringBooleanFlagSchema = z.union([
  z
    .custom((val) => typeof val === "string" && val.toLowerCase() === "true")
    .transform(() => true),
  z
    .custom((val) => typeof val === "string" && val.toLowerCase() === "false")
    .transform(() => false),
]);

/**
 * @typedef {("warn" | "fatal" | "error" | "info" | "debug" | "trace" | "silent")} LogLevel
 * @type {Record<"test" | "development" | "production", LogLevel>}
 */
const DEFAULT_LOG_LEVELS = {
  development: "info",
  production: "warn",
  test: "silent",
};

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().optional(),
    DATABASE_NAME: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_USER: z.string().optional(),
    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: z.number().int().positive().optional(),
    DATABASE_LOG_LEVEL: PrismaLogLevelSchema.default(
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
    ),
    NODE_ENV: z.enum(["development", "test", "production"]),
    PRETTY_LOGGING: stringBooleanFlagSchema.default(
      process.env.NODE_ENV === "development" ? true : false
    ),
    CLERK_SECRET_KEY: z
      .string()
      .startsWith(
        process.env.NODE_ENV === "development" ? "sk_test" : "sk_live"
      ),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .startsWith(
        process.env.NODE_ENV === "development" ? "pk_test" : "pk_live"
      ),
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
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_LOG_LEVEL: process.env.DATABASE_LOG_LEVEL,
    NODE_ENV: process.env.NODE_ENV,
    PRETTY_LOGGING: process.env.PRETTY_LOGGING,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA:
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
